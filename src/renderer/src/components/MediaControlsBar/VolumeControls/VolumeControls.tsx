import VolumeBar from "./VolumeBar";
import { I18nAriaLabels } from "@/types";
import VolumeButton from "./VolumeButton";

interface VolumeControlsProps {
  audio: HTMLAudioElement | null;
  onClickedVolumeButton: () => void;
  i18nAriaLabels?: I18nAriaLabels;
}

function VolumeControls({ audio, onClickedVolumeButton, i18nAriaLabels }: VolumeControlsProps): JSX.Element {
  return (
    <div
      className="flex items-center"
      style={{
        flex: "0 1 7.75rem",
      }}
    >
      <VolumeButton audio={audio} i18nAriaLabels={i18nAriaLabels} onClick={onClickedVolumeButton} />
      <VolumeBar audio={audio} i18nVolumeControl={i18nAriaLabels?.volumeControl} initVolume={1} />
    </div>
  );
}

export default VolumeControls;
