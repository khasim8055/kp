export type ResearchTrack = {
  id: string;
  name: string;
  /** Real progress is not filled in yet. Do not replace TODO with a guessed percentage. */
  progress: "TODO";
};

export const tracks: ResearchTrack[] = [
  { id: "robotics", name: "Robotics and ROS 2", progress: "TODO" },
  { id: "vision", name: "Computer Vision", progress: "TODO" },
  { id: "german", name: "German B1", progress: "TODO" },
];
