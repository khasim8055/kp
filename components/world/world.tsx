import { WorldLive } from "@/components/world/world-live";

/**
 * The 3D world behind every page. The CSS grid floor is there from the first
 * paint and stays if WebGL is missing or too slow. The WebGL scene loads after
 * the page and fades in over it.
 */
export function World() {
  return (
    <div className="world" data-world aria-hidden="true">
      <div className="world-glow" />
      <div className="world-floor" />
      <WorldLive />
    </div>
  );
}
