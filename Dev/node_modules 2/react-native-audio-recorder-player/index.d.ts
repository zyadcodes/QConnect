export declare enum AudioSourceAndroidType {
    DEFAULT = 0,
    MIC = 1,
    VOICE_UPLINK = 2,
    VOICE_DOWNLINK = 3,
    VOICE_CALL = 4,
    CAMCORDER = 5,
    VOICE_RECOGNITION = 6,
    VOICE_COMMUNICATION = 7,
    REMOTE_SUBMIX = 8,
    UNPROCESSED = 9,
    RADIO_TUNER = 1998,
    HOTWORD = 1999
}
export declare enum OutputFormatAndroidType {
    DEFAULT = 0,
    THREE_GPP = 1,
    MPEG_4 = 2,
    AMR_NB = 3,
    AMR_WB = 4,
    AAC_ADIF = 5,
    AAC_ADTS = 6,
    OUTPUT_FORMAT_RTP_AVP = 7,
    MPEG_2_TS = 8,
    WEBM = 9
}
export declare enum AudioEncoderAndroidType {
    DEFAULT = 0,
    AMR_NB = 1,
    AMR_WB = 2,
    AAC = 3,
    HE_AAC = 4,
    AAC_ELD = 5,
    VORBIS = 6
}
declare type AVEncodingType = AVEncodingOption.lpcm | AVEncodingOption.ima4 | AVEncodingOption.aac | AVEncodingOption.MAC3 | AVEncodingOption.MAC6 | AVEncodingOption.ulaw | AVEncodingOption.alaw | AVEncodingOption.mp1 | AVEncodingOption.mp2 | AVEncodingOption.alac | AVEncodingOption.amr | AVEncodingOption.flac | AVEncodingOption.opus;
export declare enum AVEncodingOption {
    lpcm = "lpcm",
    ima4 = "ima4",
    aac = "aac",
    MAC3 = "MAC3",
    MAC6 = "MAC6",
    ulaw = "ulaw",
    alaw = "alaw",
    mp1 = "mp1",
    mp2 = "mp2",
    alac = "alac",
    amr = "amr",
    flac = "flac",
    opus = "opus"
}
export declare enum AVEncoderAudioQualityIOSType {
    min = 0,
    low = 32,
    medium = 64,
    high = 96,
    max = 127
}
export interface AudioSet {
    AVSampleRateKeyIOS?: number;
    AVFormatIDKeyIOS?: AVEncodingType;
    AVNumberOfChannelsKeyIOS?: number;
    AVEncoderAudioQualityKeyIOS?: AVEncoderAudioQualityIOSType;
    AudioSourceAndroid?: AudioSourceAndroidType;
    OutputFormatAndroid?: OutputFormatAndroidType;
    AudioEncoderAndroid?: AudioEncoderAndroidType;
}
declare class AudioRecorderPlayer {
    private _isRecording;
    private _isPlaying;
    private _recorderSubscription;
    private _playerSubscription;
    private _recordInterval;
    mmss: (secs: number) => string;
    mmssss: (milisecs: number) => string;
    /**
     * set listerner from native module for recorder.
     * @returns {callBack(e: any)}
     */
    addRecordBackListener: (e: any) => void;
    /**
     * remove listener for recorder.
     * @returns {void}
     */
    removeRecordBackListener: () => void;
    /**
     * set listener from native module for player.
     * @returns {callBack(e: Event)}
     */
    addPlayBackListener: (e: any) => void;
    /**
     * remove listener for player.
     * @returns {void}
     */
    removePlayBackListener: () => void;
    /**
     * start recording with param.
     * @param {string} uri audio uri.
     * @returns {Promise<string>}
     */
    startRecorder: (uri?: string, audioSets?: AudioSet) => Promise<string>;
    /**
     * stop recording.
     * @returns {Promise<string>}
     */
    stopRecorder: () => Promise<string>;
    /**
     * resume playing.
     * @returns {Promise<string>}
     */
    resumePlayer: () => Promise<string>;
    /**
     * start playing with param.
     * @param {string} uri audio uri.
     * @returns {Promise<string>}
     */
    startPlayer: (uri: string) => Promise<string>;
    /**
     * stop playing.
     * @returns {Promise<string>}
     */
    stopPlayer: () => Promise<string>;
    /**
     * pause playing.
     * @returns {Promise<string>}
     */
    pausePlayer: () => Promise<string>;
    /**
     * seek to.
     * @param {number} time position seek to in second.
     * @returns {Promise<string>}
     */
    seekToPlayer: (time: number) => Promise<string>;
    /**
     * set volume.
     * @param {number} setVolume set volume.
     * @returns {Promise<string>}
     */
    setVolume: (volume: number) => Promise<string>;
    /**
     * set subscription duration.
     * @param {number} sec subscription callback duration in seconds.
     * @returns {Promise<string>}
     */
    setSubscriptionDuration: (sec: number) => Promise<string>;
}
export default AudioRecorderPlayer;
