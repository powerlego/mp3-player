<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import CurrentTime from "@components/CurrentTime.vue";
import Duration from "@components/Duration.vue";
import PlayButton from "@components/PlayButton.vue";
import ProgressBar from "@components/ProgressBar.vue";
import RepeatButton from "@components/RepeatButton.vue";
import ShuffleButton from "@components/ShuffleButton.vue";
import SkipBackButton from "@components/SkipBackButton.vue";
import SkipForwardButton from "@components/SkipForwardButton.vue";
import SongArtists from "@components/SongArtists.vue";
import SongDetails from "@components/SongDetails.vue";
import SongName from "@components/SongName.vue";
import { storeToRefs } from "pinia";
import { useAudio } from "@stores/audio";
import { useMediaKeyBindings } from "@stores/mediaKeyBindings";

const props = withDefaults(defineProps<{
  progressUpdateInterval?: number;
  volumeJumpStep?: number;
}>(), {
  progressUpdateInterval: 0,
  volumeJumpStep: 0.05,
});

const audioStore = useAudio();

const { audio } = storeToRefs(audioStore);
const { getNextSong, play, pause, skipPrevious, togglePlay, jumpVolume, incrementRepeatMode, toggleMute, toggleShuffle } = audioStore;
const { keyBindings, combineKeyCodes } = useMediaKeyBindings();


const songName = ref("");
const songArtists = ref("");
const coverArt = ref("");

</script>
