/**
 * Page scroll progress as a thin bar under the top edge. Driven by a CSS
 * scroll timeline, so it costs no JavaScript. Browsers without scroll
 * timelines do not show it.
 */
export function ScrollProgress() {
  return <div className="scroll-bar" aria-hidden="true" />;
}
