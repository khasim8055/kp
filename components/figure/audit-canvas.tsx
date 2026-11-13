"use client";

import { useEffect, useRef } from "react";
import {
  AUDIT_CAMERA,
  AUDIT_POSE,
  axisTicks,
  buildAuditData,
  frameEdges,
  projectPoint,
} from "@/lib/audit-field";
import { createFrameGuard, linkProgram, parseColor, type Rgb } from "@/lib/webgl";

export type AuditLabels = {
  record: string;
  tooClose: string;
  farEnough: string;
};

const POINT_VS = `
attribute vec3 aPos;
attribute float aKind;
attribute float aState;
uniform vec2 uRot;
uniform vec4 uCam;
varying float vKind;
varying float vState;
varying float vDepth;
vec3 turn(vec3 p) {
  float cy = cos(uRot.x); float sy = sin(uRot.x);
  float x1 = p.x * cy + p.z * sy;
  float z1 = -p.x * sy + p.z * cy;
  float cp = cos(uRot.y); float sp = sin(uRot.y);
  return vec3(x1, p.y * cp - z1 * sp, p.y * sp + z1 * cp);
}
void main() {
  vec3 r = turn(aPos);
  float w = uCam.y - r.z;
  gl_Position = vec4(r.x * uCam.x / max(uCam.z, 1.0), r.y * uCam.x * min(uCam.z, 1.0), 0.0, w);
  float base = aKind < 0.5 ? 13.0 : 7.4;
  float grow = aState > 1.5 ? 1.5 : (aState > 0.5 ? 1.2 : 1.0);
  gl_PointSize = base * uCam.w * grow * (uCam.y / w);
  vKind = aKind;
  vState = aState;
  vDepth = w;
}`;

const POINT_FS = `
precision mediump float;
uniform vec3 uReal;
uniform vec3 uSynth;
uniform vec3 uFlag;
uniform vec3 uPass;
uniform float uDist;
varying float vKind;
varying float vState;
varying float vDepth;
void main() {
  float r = length(gl_PointCoord * 2.0 - 1.0);
  float a;
  if (vKind < 0.5) {
    a = smoothstep(1.0, 0.86, r) * smoothstep(0.56, 0.7, r);
  } else {
    a = smoothstep(1.0, 0.72, r);
  }
  vec3 col = vKind < 0.5 ? uReal : uSynth;
  if (vState > 0.5) col = uFlag;
  if (vState > 1.5 && vState < 2.5) col = uPass;
  float fade = clamp(1.15 - (vDepth - uDist + 1.2) * 0.32, 0.35, 1.0);
  float strength = vState > 0.5 ? 1.0 : (vKind < 0.5 ? 0.62 : 0.85);
  gl_FragColor = vec4(col, a * fade * strength);
}`;

const LINE_VS = `
attribute vec3 aPos;
attribute vec4 aColor;
uniform vec2 uRot;
uniform vec4 uCam;
varying vec4 vColor;
vec3 turn(vec3 p) {
  float cy = cos(uRot.x); float sy = sin(uRot.x);
  float x1 = p.x * cy + p.z * sy;
  float z1 = -p.x * sy + p.z * cy;
  float cp = cos(uRot.y); float sp = sin(uRot.y);
  return vec3(x1, p.y * cp - z1 * sp, p.y * sp + z1 * cp);
}
void main() {
  vec3 r = turn(aPos);
  float w = uCam.y - r.z;
  gl_Position = vec4(r.x * uCam.x / max(uCam.z, 1.0), r.y * uCam.x * min(uCam.z, 1.0), 0.0, w);
  vColor = aColor;
}`;

const LINE_FS = `
precision mediump float;
varying vec4 vColor;
void main() { gl_FragColor = vColor; }`;

/**
 * WebGL layer of the hero figure. It mounts on top of the static SVG and
 * replaces it once the first frame is drawn. If WebGL is missing, the context
 * is lost, or the visitor prefers reduced motion, the SVG simply stays.
 */
export function AuditCanvas({ labels }: { labels: AuditLabels }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const labelsRef = useRef(labels);

  useEffect(() => {
    labelsRef.current = labels;
  }, [labels]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const label = labelRef.current;
    const host = canvas?.closest<HTMLElement>("[data-audit]");
    if (!canvas || !label || !host) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: true,
      premultipliedAlpha: false,
      powerPreference: "low-power",
    });
    if (!gl) return;

    const points = linkProgram(gl, POINT_VS, POINT_FS);
    const lines = linkProgram(gl, LINE_VS, LINE_FS);
    if (!points || !lines) return;

    const data = buildAuditData();
    const realCount = data.real.length / 3;
    const synthCount = data.synth.length / 3;
    const total = realCount + synthCount;

    // One buffer for every point: position, kind (0 ring, 1 dot), state.
    const positions = new Float32Array(total * 3);
    positions.set(data.real, 0);
    positions.set(data.synth, realCount * 3);
    const kinds = new Float32Array(total);
    kinds.fill(1, realCount);
    const states = new Float32Array(total);

    const posBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
    const kindBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, kindBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, kinds, gl.STATIC_DRAW);
    const stateBuffer = gl.createBuffer();
    const lineBuffer = gl.createBuffer();

    const frame = frameEdges();
    const ticks = axisTicks();
    const flaggedIds = data.flagged
      .map((isFlagged, index) => (isFlagged ? index : -1))
      .filter((index) => index >= 0);
    const safeIds = data.flagged
      .map((isFlagged, index) => (isFlagged ? -1 : index))
      .filter((index) => index >= 0);
    // Tour used when no pointer is near: one flagged record, then a safe one.
    const tour: number[] = [];
    for (let i = 0; i < Math.max(flaggedIds.length, 4); i += 1) {
      const flaggedId = flaggedIds[i % Math.max(flaggedIds.length, 1)];
      const safeId = safeIds[(i * 7) % Math.max(safeIds.length, 1)];
      if (flaggedId !== undefined) tour.push(flaggedId);
      if (safeId !== undefined) tour.push(safeId);
    }

    const maxSegments = frame.length + ticks.length + flaggedIds.length + 1;
    const lineData = new Float32Array(maxSegments * 2 * 7);

    let colors = {
      real: [0.93, 0.95, 0.94] as Rgb,
      synth: [0.49, 0.61, 1] as Rgb,
      flag: [0.96, 0.73, 0.28] as Rgb,
      pass: [0.2, 0.84, 0.69] as Rgb,
      frame: [0.55, 0.6, 0.58] as Rgb,
    };
    const readColors = () => {
      const style = getComputedStyle(host);
      colors = {
        real: parseColor(style.getPropertyValue("--text"), colors.real),
        synth: parseColor(style.getPropertyValue("--pulse"), colors.synth),
        flag: parseColor(style.getPropertyValue("--signal"), colors.flag),
        pass: parseColor(style.getPropertyValue("--pass"), colors.pass),
        frame: parseColor(style.getPropertyValue("--muted"), colors.frame),
      };
    };
    readColors();
    const themeWatch = new MutationObserver(readColors);
    themeWatch.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "style"],
    });

    let width = 1;
    let height = 1;
    let dpr = 1;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.round(width * dpr);
      const h = Math.round(height * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      gl.viewport(0, 0, w, h);
    };
    const sizeWatch = new ResizeObserver(resize);
    sizeWatch.observe(canvas);
    resize();

    const pointer = { x: 0.5, y: 0.5, px: -9999, py: -9999, active: false };
    const fine = window.matchMedia("(pointer: fine)").matches;
    const onMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.px = event.clientX - rect.left;
      pointer.py = event.clientY - rect.top;
      pointer.active =
        pointer.px > -40 &&
        pointer.py > -40 &&
        pointer.px < rect.width + 40 &&
        pointer.py < rect.height + 40;
      pointer.x = Math.min(1, Math.max(0, pointer.px / rect.width));
      pointer.y = Math.min(1, Math.max(0, pointer.py / rect.height));
    };
    if (fine) window.addEventListener("pointermove", onMove, { passive: true });

    let yaw: number = AUDIT_POSE.yaw;
    let pitch: number = AUDIT_POSE.pitch;
    let probe = -1;
    let shownProbe = -2;
    let tourIndex = 0;
    let tourClock = 0;
    let raf = 0;
    let last = 0;
    let visible = false;
    let ready = false;
    let lost = false;
    const start = performance.now();

    const setUniforms = (program: WebGLProgram) => {
      gl.uniform2f(gl.getUniformLocation(program, "uRot"), yaw, pitch);
      gl.uniform4f(
        gl.getUniformLocation(program, "uCam"),
        AUDIT_CAMERA.focal,
        AUDIT_CAMERA.distance,
        width / height,
        (Math.min(width, height) / 520) * dpr,
      );
    };

    const toScreen = (x: number, y: number, z: number) => {
      const p = projectPoint(x, y, z, yaw, pitch, width / height);
      return {
        x: (p.x * 0.5 + 0.5) * width,
        y: (1 - (p.y * 0.5 + 0.5)) * height,
      };
    };

    const pickProbe = (dt: number) => {
      if (pointer.active) {
        let best = -1;
        let bestDist = 46 * 46;
        for (let s = 0; s < synthCount; s += 1) {
          const p = toScreen(
            data.synth[s * 3] ?? 0,
            data.synth[s * 3 + 1] ?? 0,
            data.synth[s * 3 + 2] ?? 0,
          );
          const d = (p.x - pointer.px) ** 2 + (p.y - pointer.py) ** 2;
          if (d < bestDist) {
            bestDist = d;
            best = s;
          }
        }
        if (best >= 0) {
          probe = best;
          tourClock = 0;
          return;
        }
      }
      tourClock += dt;
      if (probe < 0 || tourClock > 3200) {
        tourClock = 0;
        probe = tour[tourIndex % Math.max(tour.length, 1)] ?? 0;
        tourIndex += 1;
      }
    };

    const pushLine = (
      offset: number,
      seg: number[],
      color: Rgb,
      alpha: number,
    ) => {
      for (let end = 0; end < 2; end += 1) {
        const o = offset + end * 7;
        lineData[o] = seg[end * 3] ?? 0;
        lineData[o + 1] = seg[end * 3 + 1] ?? 0;
        lineData[o + 2] = seg[end * 3 + 2] ?? 0;
        lineData[o + 3] = color[0];
        lineData[o + 4] = color[1];
        lineData[o + 5] = color[2];
        lineData[o + 6] = alpha;
      }
      return offset + 14;
    };

    const pairSegment = (s: number) => {
      const r = data.nearest[s] ?? 0;
      return [
        data.synth[s * 3] ?? 0,
        data.synth[s * 3 + 1] ?? 0,
        data.synth[s * 3 + 2] ?? 0,
        data.real[r * 3] ?? 0,
        data.real[r * 3 + 1] ?? 0,
        data.real[r * 3 + 2] ?? 0,
      ];
    };

    const updateLabel = () => {
      if (probe < 0) return;
      const p = toScreen(
        data.synth[probe * 3] ?? 0,
        data.synth[probe * 3 + 1] ?? 0,
        data.synth[probe * 3 + 2] ?? 0,
      );
      const right = p.x > width * 0.62;
      const x = Math.round(right ? p.x - 14 : p.x + 14);
      const y = Math.round(Math.min(height - 44, Math.max(4, p.y - 18)));
      label.style.transform = `translate3d(${x}px, ${y}px, 0) translateX(${right ? "-100%" : "0"})`;
      if (probe === shownProbe) return;
      shownProbe = probe;
      const isFlagged = Boolean(data.flagged[probe]);
      const text = labelsRef.current;
      const id = String(probe + 1).padStart(3, "0");
      const d = (data.dist[probe] ?? 0).toFixed(3);
      label.dataset.state = isFlagged ? "flag" : "pass";
      (label.firstElementChild as HTMLElement).textContent = `${text.record} ${id}`;
      (label.lastElementChild as HTMLElement).textContent =
        `d = ${d} · ${isFlagged ? text.tooClose : text.farEnough}`;
      label.style.opacity = "1";
    };

    const draw = (now: number) => {
      raf = requestAnimationFrame(draw);
      // Idle motion is slow, so 30 frames a second is enough. Full rate only
      // while the pointer is on the figure.
      if (!pointer.active && last && now - last < 30) return;
      if (guard(now)) return;
      const dt = last ? Math.min(48, now - last) : 16;
      last = now;
      const t = (now - start) / 1000;

      const targetYaw =
        AUDIT_POSE.yaw + Math.sin(t * 0.16) * 0.42 + (pointer.x - 0.5) * 0.5;
      const targetPitch =
        AUDIT_POSE.pitch + Math.sin(t * 0.11) * 0.05 + (pointer.y - 0.5) * 0.22;
      const ease = 1 - Math.pow(0.001, dt / 1000);
      yaw += (targetYaw - yaw) * ease;
      pitch += (targetPitch - pitch) * ease;

      pickProbe(dt);

      states.fill(0);
      for (const s of flaggedIds) {
        states[realCount + s] = 1;
        states[data.nearest[s] ?? 0] = 1;
      }
      if (probe >= 0) {
        // 1 flagged, 2 probed and safe, 3 probed and flagged
        const mark = data.flagged[probe] ? 3 : 2;
        states[realCount + probe] = mark;
        states[data.nearest[probe] ?? 0] = mark;
      }

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.enable(gl.BLEND);
      gl.blendFuncSeparate(
        gl.SRC_ALPHA,
        gl.ONE_MINUS_SRC_ALPHA,
        gl.ONE,
        gl.ONE_MINUS_SRC_ALPHA,
      );

      let offset = 0;
      for (const edge of frame) offset = pushLine(offset, edge, colors.frame, 0.42);
      for (const tick of ticks) offset = pushLine(offset, tick, colors.frame, 0.8);
      for (const s of flaggedIds) {
        if (s !== probe) offset = pushLine(offset, pairSegment(s), colors.flag, 0.55);
      }
      if (probe >= 0) {
        offset = pushLine(
          offset,
          pairSegment(probe),
          data.flagged[probe] ? colors.flag : colors.pass,
          1,
        );
      }

      gl.useProgram(lines);
      setUniforms(lines);
      gl.bindBuffer(gl.ARRAY_BUFFER, lineBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, lineData.subarray(0, offset), gl.DYNAMIC_DRAW);
      const linePos = gl.getAttribLocation(lines, "aPos");
      const lineColor = gl.getAttribLocation(lines, "aColor");
      gl.enableVertexAttribArray(linePos);
      gl.vertexAttribPointer(linePos, 3, gl.FLOAT, false, 28, 0);
      gl.enableVertexAttribArray(lineColor);
      gl.vertexAttribPointer(lineColor, 4, gl.FLOAT, false, 28, 12);
      gl.drawArrays(gl.LINES, 0, offset / 7);
      gl.disableVertexAttribArray(lineColor);

      gl.useProgram(points);
      setUniforms(points);
      gl.uniform3fv(gl.getUniformLocation(points, "uReal"), colors.real);
      gl.uniform3fv(gl.getUniformLocation(points, "uSynth"), colors.synth);
      gl.uniform3fv(gl.getUniformLocation(points, "uFlag"), colors.flag);
      gl.uniform3fv(gl.getUniformLocation(points, "uPass"), colors.pass);
      gl.uniform1f(gl.getUniformLocation(points, "uDist"), AUDIT_CAMERA.distance);
      const aPos = gl.getAttribLocation(points, "aPos");
      const aKind = gl.getAttribLocation(points, "aKind");
      const aState = gl.getAttribLocation(points, "aState");
      gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
      gl.enableVertexAttribArray(aPos);
      gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 0, 0);
      gl.bindBuffer(gl.ARRAY_BUFFER, kindBuffer);
      gl.enableVertexAttribArray(aKind);
      gl.vertexAttribPointer(aKind, 1, gl.FLOAT, false, 0, 0);
      gl.bindBuffer(gl.ARRAY_BUFFER, stateBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, states, gl.DYNAMIC_DRAW);
      gl.enableVertexAttribArray(aState);
      gl.vertexAttribPointer(aState, 1, gl.FLOAT, false, 0, 0);
      gl.drawArrays(gl.POINTS, 0, total);
      gl.disableVertexAttribArray(aKind);
      gl.disableVertexAttribArray(aState);

      updateLabel();

      if (!ready) {
        ready = true;
        host.dataset.live = "true";
      }
    };

    // Slow-device guard: on a weak GPU the figure stops for good and the
    // static SVG stays. Pauses are not counted as slow frames.
    const frameGuard = createFrameGuard();
    const guard = (now: number) => {
      if (!frameGuard.tick(now)) return false;
      lost = true;
      delete host.dataset.live;
      label.style.opacity = "0";
      sync();
      return true;
    };

    // The loop only runs while the figure is on screen and the tab is visible.
    const sync = () => {
      const shouldRun = visible && !document.hidden && !lost;
      if (shouldRun && !raf) {
        last = 0;
        frameGuard.resume();
        raf = requestAnimationFrame(draw);
      } else if (!shouldRun && raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };
    const viewWatch = new IntersectionObserver(([entry]) => {
      visible = Boolean(entry?.isIntersecting);
      sync();
    });
    viewWatch.observe(canvas);
    document.addEventListener("visibilitychange", sync);

    const onLost = (event: Event) => {
      event.preventDefault();
      lost = true;
      delete host.dataset.live;
      label.style.opacity = "0";
      sync();
    };
    canvas.addEventListener("webglcontextlost", onLost);

    sync();

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", sync);
      viewWatch.disconnect();
      sizeWatch.disconnect();
      themeWatch.disconnect();
      canvas.removeEventListener("webglcontextlost", onLost);
      if (fine) window.removeEventListener("pointermove", onMove);
      delete host.dataset.live;
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} className="audit-canvas" aria-hidden="true" />
      <div ref={labelRef} className="audit-label" aria-hidden="true">
        <span />
        <span />
      </div>
    </>
  );
}
