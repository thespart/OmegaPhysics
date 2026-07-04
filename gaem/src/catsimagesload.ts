// типо кэтс.тс как кэтупескрипт.тупескрипт понятно ха-ха?!!!!!
export function ImagesToList(amount: number): string[] {
  const ListOfImages = [];
  for (let i = 0; i < amount; i++) {
    ListOfImages.push(
      "/OmegaPhysics/OmegaPhysics/assets/images/sashkas/" + (i + 1) + ".png",
    );
  }
  return ListOfImages;
}
