import AppleItemListBox from "./boxes/appleItemListBox";
import Genres from "../genres";
import IsoMetaBox from "./boxes/isoMetaBox";
import IsoUserDataBox from "./boxes/isoUserDataBox";
import Mpeg4BoxType from "./mpeg4BoxType";
import Mpeg4HandlerType from "./mpeg4HandlerType";
import { AppleDataBox, AppleDataBoxFlagType } from "./boxes/appleDataBox";
import { ByteVector, StringType } from "../byteVector";
import { IPicture, Picture } from "../picture";
import { Tag, TagTypes } from "../tag";
import { ArrayUtils, DateUtils, Guards, NumberUtils } from "../utils";

export default class AppleTag extends Tag {
	/**
	 * Contains the ISO meta box in which that tag will be stored.
	 */
	private readonly _metaBox: IsoMetaBox;

	/**
	 * Contains the ILST box which holds all the values.
	 */
	private readonly _ilstBox: AppleItemListBox;

	/**
	 * Constructs and initializes a new instance of {@link AppleTag} for a specified ISO user data box.
	 * @param box A {@link IsoUserDataBox} from which the tag is to be read.
	 */
	public constructor(box: IsoUserDataBox) {
		super();

		Guards.truthy(box, "box");

		this._metaBox = box.getChild<IsoMetaBox>(Mpeg4BoxType.META);
		if (!this._metaBox) {
			this._metaBox = IsoMetaBox.fromHandler(Mpeg4HandlerType.MDIR);
			box.addChild(this._metaBox);
		}

		this._ilstBox = this._metaBox.getChild<AppleItemListBox>(Mpeg4BoxType.ILST);
		if (!this._ilstBox) {
			this._ilstBox = AppleItemListBox.fromEmpty();
			this._metaBox.addChild(this._ilstBox);
		}
	}

	/** @inheritDoc */
	public get tagTypes(): TagTypes {
		return TagTypes.Apple;
	}

	/** @inheritDoc */
	public get sizeOnDisk(): number {
		return undefined;
	}

	/** @inheritDoc */
	public get title(): string {
		return this.getFirstQuickTimeString(Mpeg4BoxType.NAM);
	}
	/** @inheritDoc */
	public set title(v: string) {
		this.setQuickTimeString(Mpeg4BoxType.NAM, v);
	}

	/** @inheritDoc */
	public get subtitle(): string {
		return this.getFirstQuickTimeString(Mpeg4BoxType.SUBT);
	}
	/** @inheritDoc */
	public set subtitle(v: string) {
		this.setQuickTimeString(Mpeg4BoxType.SUBT, v);
	}

	/** @inheritDoc */
	public get description(): string {
		return this.getFirstQuickTimeString(Mpeg4BoxType.DESC);
	}
	/** @inheritDoc */
	public set description(v: string) {
		this.setQuickTimeString(Mpeg4BoxType.DESC, v);
	}

	/** @inheritDoc */
	public get performers(): string[] {
		return this.getQuickTimeStrings(Mpeg4BoxType.ART);
	}
	/** @inheritDoc */
	public set performers(v: string[]) {
		this.setQuickTimeStrings(Mpeg4BoxType.ART, v);
	}

	/** @inheritDoc */
	public get performersRole(): string[] {
		return this.getQuickTimeStrings(Mpeg4BoxType.ROLE).map((s) => s.replace(/\//g, ";").trim());
	}
	/** @inheritDoc */
	public set performersRole(v: string[]) {
		// @TODO: handle undefined performers better
		v = v?.map((e) => e.replace(/;/g, "/"));
		this.setQuickTimeStrings(Mpeg4BoxType.ROLE, v);
	}

	/** @inheritDoc */
	public get albumArtists(): string[] {
		return this.getQuickTimeStrings(Mpeg4BoxType.AART);
	}
	/** @inheritDoc */
	public set albumArtists(v: string[]) {
		this.setQuickTimeStrings(Mpeg4BoxType.AART, v);
	}

	/** @inheritDoc */
	public get composers(): string[] {
		return this.getQuickTimeStrings(Mpeg4BoxType.WRT);
	}
	/** @inheritDoc */
	public set composers(v: string[]) {
		this.setQuickTimeStrings(Mpeg4BoxType.WRT, v);
	}

	/** @inheritDoc */
	public get album(): string {
		return this.getFirstQuickTimeString(Mpeg4BoxType.ALB);
	}
	/** @inheritDoc */
	public set album(v: string) {
		this.setQuickTimeString(Mpeg4BoxType.ALB, v);
	}

	/** @inheritDoc */
	public get comment(): string {
		return this.getFirstQuickTimeString(Mpeg4BoxType.CMT);
	}
	/** @inheritDoc */
	public set comment(v: string) {
		this.setQuickTimeString(Mpeg4BoxType.CMT, v);
	}

	/** @inheritDoc */
	public get genres(): string[] {
		let text = this.getQuickTimeStrings(Mpeg4BoxType.GEN);
		if (text.length === 0) {
			for (const data of this.getQuickTimeData(Mpeg4BoxType.GNRE)) {
				// iTunes stores genre's in the GNRE box as (ID3# + 1).
				// @TODO This is not true, see list of genres https://exiftool.org/TagNames/QuickTime.html
				const index = data.toUshort(true);
				if (index === 0) {
					continue;
				}

				const str = Genres.indexToAudio(index - 1, false);
				if (!str) {
					continue;
				}

				text = [str];
				break;
			}
		}

		return text;
	}
	/** @inheritDoc */
	public set genres(v: string[]) {
		// @TODO: Allow using itunes genres via config
		this._ilstBox.removeChildByType(Mpeg4BoxType.GNRE);
		this.setQuickTimeStrings(Mpeg4BoxType.GEN, v);
	}

	/** @inheritDoc */
	public get year(): number {
		for (const str of this.getQuickTimeStrings(Mpeg4BoxType.DAY)) {
			const textWithMaxLengthOfFour = str.substring(0, 4);
			const value = Number.parseInt(textWithMaxLengthOfFour, 10);
			if (!Number.isNaN(value)) {
				return value;
			}
		}

		return 0;
	}
	/** @inheritDoc */
	public set year(v: number) {
		Guards.uint(v, "v");
		if (v === 0) {
			this._ilstBox.removeChildByType(Mpeg4BoxType.DAY);
		} else {
			this.setQuickTimeString(Mpeg4BoxType.DAY, v.toString());
		}
	}

	/** @inheritDoc */
	public get track(): number {
		const data = this.getFirstQuickTimeData(Mpeg4BoxType.TRKN, undefined, (b) => b.length >= 4);
		return data ? data.subarray(2, 2).toUshort() : 0;
	}
	/** @inheritDoc */
	public set track(v: number) {
		this.setFractionalNumber(Mpeg4BoxType.TRKN, v, this.trackCount);
	}

	/** @inheritDoc */
	public get trackCount(): number {
		const data = this.getFirstQuickTimeData(Mpeg4BoxType.TRKN, undefined, (b) => b.length >= 6);
		return data ? data.subarray(4, 2).toUshort() : 0;
	}
	/** @inheritDoc */
	public set trackCount(v: number) {
		this.setFractionalNumber(Mpeg4BoxType.TRKN, this.track, v);
	}

	/** @inheritDoc */
	public get disc(): number {
		const data = this.getFirstQuickTimeData(Mpeg4BoxType.DISK, undefined, (b) => b.length >= 4);
		return data ? data.subarray(2, 2).toUshort() : 0;
	}
	/** @inheritDoc */
	public set disc(v: number) {
		this.setFractionalNumber(Mpeg4BoxType.DISK, v, this.discCount);
	}

	/** @inheritDoc */
	public get discCount(): number {
		const data = this.getFirstQuickTimeData(Mpeg4BoxType.DISK, undefined, (b) => b.length >= 6);
		return data ? data.subarray(4, 2).toUshort() : 0;
	}
	/** @inheritDoc */
	public set discCount(v: number) {
		this.setFractionalNumber(Mpeg4BoxType.DISK, this.disc, v);
	}

	/** @inheritDoc */
	public get lyrics(): string {
		return this.getFirstQuickTimeString(Mpeg4BoxType.LYR);
	}
	/** @inheritDoc */
	public set lyrics(v: string) {
		this.setQuickTimeString(Mpeg4BoxType.LYR, v);
	}

	/** @inheritDoc */
	public get grouping(): string {
		return this.getFirstQuickTimeString(Mpeg4BoxType.GRP);
	}
	/** @inheritDoc */
	public set grouping(v: string) {
		this.setQuickTimeString(Mpeg4BoxType.GRP, v);
	}

	/** @inheritDoc */
	public get beatsPerMinute(): number {
		const data = this.getFirstQuickTimeData(Mpeg4BoxType.TMPO, AppleDataBoxFlagType.ForTempo);
		return data ? data.toUint() : 0;
	}
	/** @inheritDoc */
	public set beatsPerMinute(v: number) {
		Guards.uint(v, "v");
		const data = v === 0 ? undefined : [ByteVector.fromUshort(v)];
		this.setQuickTimeData(Mpeg4BoxType.TMPO, data, AppleDataBoxFlagType.ForTempo);
	}

	/** @inheritDoc */
	public get conductor(): string {
		return this.getFirstQuickTimeString(Mpeg4BoxType.COND);
	}
	/** @inheritDoc */
	public set conductor(v: string) {
		this.setQuickTimeString(Mpeg4BoxType.COND, v);
	}

	/** @inheritDoc */
	public get copyright(): string {
		return this.getFirstQuickTimeString(Mpeg4BoxType.CPRT);
	}
	/** @inheritDoc */
	public set copyright(v: string) {
		this.setQuickTimeString(Mpeg4BoxType.CPRT, v);
	}

	/** @inheritDoc */
	public get dateTagged(): Date | undefined {
		for (const text of this.getQuickTimeStrings(Mpeg4BoxType.DTAG)) {
			const date = new Date(text);
			if (!isNaN(date.getTime())) {
				return date;
			}
		}

		return undefined;
	}
	/** @inheritDoc */
	public set dateTagged(value: Date | undefined) {
		this.setQuickTimeString(Mpeg4BoxType.DTAG, DateUtils.format(value));
	}

	/** @inheritDoc */
	public get albumArtistsSort(): string[] {
		return this.getQuickTimeStrings(Mpeg4BoxType.SOAA);
	}
	/** @inheritDoc */
	public set albumArtistsSort(v: string[]) {
		this.setQuickTimeStrings(Mpeg4BoxType.SOAA, v);
	}

	/** @inheritDoc */
	public get performersSort(): string[] {
		return this.getQuickTimeStrings(Mpeg4BoxType.SOAR);
	}
	/** @inheritDoc */
	public set performersSort(v: string[]) {
		this.setQuickTimeStrings(Mpeg4BoxType.SOAR, v);
	}

	/** @inheritDoc */
	public get composersSort(): string[] {
		return this.getQuickTimeStrings(Mpeg4BoxType.SOCO);
	}
	/** @inheritDoc */
	public set composersSort(v: string[]) {
		this.setQuickTimeStrings(Mpeg4BoxType.SOCO, v);
	}

	/** @inheritDoc */
	public get albumSort(): string {
		return this.getFirstQuickTimeString(Mpeg4BoxType.SOAL);
	}
	/** @inheritDoc */
	public set albumSort(v: string) {
		this.setQuickTimeString(Mpeg4BoxType.SOAL, v);
	}

	/** @inheritDoc */
	public get titleSort(): string {
		return this.getFirstQuickTimeString(Mpeg4BoxType.SONM);
	}
	/** @inheritDoc */
	public set titleSort(v: string) {
		this.setQuickTimeString(Mpeg4BoxType.SONM, v);
	}

	/** @inheritDoc */
	public get musicBrainzArtistId(): string {
		const strings = this.getItunesStrings("com.apple.iTunes", "MusicBrainz Artist Id");
		return strings.length > 0 ? strings.join("/") : undefined;
	}
	/** @inheritDoc */
	public set musicBrainzArtistId(v: string) {
		const artistIds = v.split("/");
		this.setItunesStrings("com.apple.iTunes", "MusicBrainz Artist Id", ...artistIds);
	}

	/** @inheritDoc */
	public get musicBrainzReleaseGroupId(): string {
		return this.getFirstItunesString("com.apple.iTunes", "MusicBrainz Release Group Id");
	}
	/** @inheritDoc */
	public set musicBrainzReleaseGroupId(v: string) {
		this.setItunesStrings("com.apple.iTunes", "MusicBrainz Release Group Id", v);
	}

	/** @inheritDoc */
	public get musicBrainzReleaseId(): string {
		return this.getFirstItunesString("com.apple.iTunes", "MusicBrainz Album Id");
	}
	/** @inheritDoc */
	public set musicBrainzReleaseId(v: string) {
		this.setItunesStrings("com.apple.iTunes", "MusicBrainz Album Id", v);
	}

	/** @inheritDoc */
	public get musicBrainzReleaseArtistId(): string {
		const strings = this.getItunesStrings("com.apple.iTunes", "MusicBrainz Album Artist Id");
		return strings.length > 0 ? strings.join("/") : undefined;
	}
	/** @inheritDoc */
	public set musicBrainzReleaseArtistId(v: string) {
		const releaseArtistIds = v.split("/");
		this.setItunesStrings("com.apple.iTunes", "MusicBrainz Album Artist Id", ...releaseArtistIds);
	}

	/** @inheritDoc */
	public get musicBrainzTrackId(): string {
		return this.getFirstItunesString("com.apple.iTunes", "MusicBrainz Track Id");
	}
	/** @inheritDoc */
	public set musicBrainzTrackId(v: string) {
		this.setItunesStrings("com.apple.iTunes", "MusicBrainz Track Id", v);
	}

	/** @inheritDoc */
	public get musicBrainzDiscId(): string {
		return this.getFirstItunesString("com.apple.iTunes", "MusicBrainz Disc Id");
	}
	/** @inheritDoc */
	public set musicBrainzDiscId(v: string) {
		this.setItunesStrings("com.apple.iTunes", "MusicBrainz Disc Id", v);
	}

	/** @inheritDoc */
	public get musicIpId(): string {
		return this.getFirstItunesString("com.apple.iTunes", "MusicIP PUID");
	}
	/** @inheritDoc */
	public set musicIpId(v: string) {
		this.setItunesStrings("com.apple.iTunes", "MusicIP PUID", v);
	}

	/** @inheritDoc */
	public get amazonId(): string {
		return this.getFirstItunesString("com.apple.iTunes", "ASIN");
	}
	/** @inheritDoc */
	public set amazonId(v: string) {
		this.setItunesStrings("com.apple.iTunes", "ASIN", v);
	}

	/** @inheritDoc */
	public get musicBrainzReleaseStatus(): string {
		return this.getFirstItunesString("com.apple.iTunes", "MusicBrainz Album Status");
	}
	/** @inheritDoc */
	public set musicBrainzReleaseStatus(v: string) {
		this.setItunesStrings("com.apple.iTunes", "MusicBrainz Album Status", v);
	}

	/** @inheritDoc */
	public get musicBrainzReleaseType(): string {
		return this.getFirstItunesString("com.apple.iTunes", "MusicBrainz Album Type");
	}
	/** @inheritDoc */
	public set musicBrainzReleaseType(v: string) {
		this.setItunesStrings("com.apple.iTunes", "MusicBrainz Album Type", v);
	}

	/** @inheritDoc */
	public get musicBrainzReleaseCountry(): string {
		return this.getFirstItunesString("com.apple.iTunes", "MusicBrainz Album Release Country");
	}
	/** @inheritDoc */
	public set musicBrainzReleaseCountry(v: string) {
		this.setItunesStrings("com.apple.iTunes", "MusicBrainz Album Release Country", v);
	}

	/** @inheritDoc */
	public get replayGainTrackGain(): number {
		let text = this.getFirstItunesString("com.apple.iTunes", "REPLAYGAIN_TRACK_GAIN");

		if (!text) {
			return NaN;
		}

		if (text.toLowerCase().endsWith("db")) {
			text = text.substring(0, text.length - 2).trim();
		}

		return Number.parseFloat(text);
	}
	/** @inheritDoc */
	public set replayGainTrackGain(v: number) {
		const value = Number.isNaN(v) ? undefined : `${v.toFixed(2)} dB`;
		this.setItunesStrings("com.apple.iTunes", "REPLAYGAIN_TRACK_GAIN", value);
	}

	/** @inheritDoc */
	public get replayGainTrackPeak(): number {
		const text = this.getFirstItunesString("com.apple.iTunes", "REPLAYGAIN_TRACK_PEAK");
		return text ? Number.parseFloat(text) : NaN;
	}
	/** @inheritDoc */
	public set replayGainTrackPeak(v: number) {
		const text = Number.isNaN(v) ? undefined : v.toFixed(6);
		this.setItunesStrings("com.apple.iTunes", "REPLAYGAIN_TRACK_PEAK", text);
	}

	/** @inheritDoc */
	public get replayGainAlbumGain(): number {
		let text = this.getFirstItunesString("com.apple.iTunes", "REPLAYGAIN_ALBUM_GAIN");

		if (!text) {
			return NaN;
		}

		if (text.toLowerCase().endsWith("db")) {
			text = text.substring(0, text.length - 2).trim();
		}

		return Number.parseFloat(text);
	}
	public set replayGainAlbumGain(v: number) {
		const value = Number.isNaN(v) ? undefined : `${v.toFixed(2)} dB`;
		this.setItunesStrings("com.apple.iTunes", "REPLAYGAIN_ALBUM_GAIN", value);
	}

	/** @inheritDoc */
	public get replayGainAlbumPeak(): number {
		const text = this.getFirstItunesString("com.apple.iTunes", "REPLAYGAIN_ALBUM_PEAK");
		return text ? Number.parseFloat(text) : NaN;
	}
	/** @inheritDoc */
	public set replayGainAlbumPeak(v: number) {
		const text = Number.isNaN(v) ? undefined : v.toFixed(6);
		this.setItunesStrings("com.apple.iTunes", "REPLAYGAIN_ALBUM_PEAK", text);
	}

	/** @inheritDoc */
	public get initialKey(): string {
		return this.getFirstItunesString("com.apple.iTunes", "initialkey");
	}
	/** @inheritDoc */
	public set initialKey(v: string) {
		this.setItunesStrings("com.apple.iTunes", "initialkey", v);
	}

	/** @inheritDoc */
	public get isrc(): string {
		return this.getFirstItunesString("com.apple.iTunes", "ISRC");
	}
	/** @inheritDoc */
	public set isrc(v: string) {
		this.setItunesStrings("com.apple.iTunes", "ISRC", v);
	}

	/** @inheritDoc */
	public get publisher(): string {
		return this.getFirstItunesString("com.apple.iTunes", "publisher");
	}
	/** @inheritDoc */
	public set publisher(v: string) {
		this.setItunesStrings("com.apple.iTunes", "publisher", v);
	}

	/** @inheritDoc */
	public get remixedBy(): string {
		return this.getFirstItunesString("com.apple.iTunes", "REMIXEDBY");
	}
	/** @inheritDoc */
	public set remixedBy(v: string) {
		this.setItunesStrings("com.apple.iTunes", "REMIXEDBY", v);
	}

	/** @inheritDoc */
	public get pictures(): IPicture[] {
		return this.getQuickTimeData(Mpeg4BoxType.COVR).map((d) => {
			return Picture.fromData(d);
		});
	}
	/** @inheritDoc */
	public set pictures(v: IPicture[]) {
		if (!v || v.length === 0) {
			this._ilstBox.removeChildByType(Mpeg4BoxType.COVR);
			return;
		}

		const boxes = v.map((picture) => {
			let flags: AppleDataBoxFlagType;
			switch (picture.mimeType) {
				case "image/jpeg":
					flags = AppleDataBoxFlagType.ContainsJpegData;
					break;
				case "image/png":
					flags = AppleDataBoxFlagType.ContainsPngData;
					break;
				case "image/x-windows-bmp":
					flags = AppleDataBoxFlagType.ContainsBmpData;
					break;
				default:
					flags = AppleDataBoxFlagType.ContainsData;
					break;
			}

			return AppleDataBox.fromDataAndFlags(picture.data, flags);
		});

		this._ilstBox.setQuickTimeBoxes(Mpeg4BoxType.COVR, boxes);
	}

	/** @inheritDoc */
	public get isCompilation(): boolean {
		const data = this.getFirstQuickTimeData(Mpeg4BoxType.CPIL);
		return !!data && data.toUint() !== 0;
	}
	/** @inheritDoc */
	public set isCompilation(v: boolean) {
		const data = v ? [ByteVector.fromByte(1)] : [];
		this.setQuickTimeData(Mpeg4BoxType.CPIL, data, AppleDataBoxFlagType.ForTempo);
	}

	/** @inheritDoc */
	public get isEmpty(): boolean {
		return !this._ilstBox.hasChildren;
	}

	/** @inheritDoc */
	public clear(): void {
		this._ilstBox.clearChildren();
	}

	// #region Public Methods

	/**
	 * Gets all strings from the iTunes boxes with the given MEAN/NAME combination.
	 * @param meanString MEAN box contents to look for
	 * @param nameString NAME box contents to look for
	 * @returns string[] Text contents of the iTunes boxes with the given NAME/MEAN combination or
	 *     `[]` if there are no matches.
	 */
	public getItunesStrings(meanString: string, nameString: string): string[] {
		// @TODO: You know, MEAN is the same for every known box. Maybe we can just drop it.
		return this._ilstBox
			.getItunesTagDataBoxes(meanString, nameString)
			.filter((b) => NumberUtils.hasFlag(b.flags, AppleDataBoxFlagType.ContainsText, true))
			.map((b) => b.text);
	}

	/**
	 * Gets the first string from the iTunes boxes with the given MEAN/NAME combination.
	 * @param meanString MEAN box contents to search for
	 * @param nameString NAME box contents to search for
	 * @returns string Text contents of the first iTunes box found with the given MEAN/NAME
	 *     combination or `undefined` if no matches found.
	 */
	public getFirstItunesString(meanString: string, nameString: string): string {
		return this.getItunesStrings(meanString, nameString)[0];
	}

	/**
	 * Gets the text contents of all boxes with the given `boxType` inside the tag's ILST box.
	 * @param boxType Type of box to search for
	 * @returns string[] Text contents of all boxes with the given `boxType` or `undefined` if no
	 *     matches were found.
	 */
	public getQuickTimeStrings(boxType: ByteVector): string[] {
		return this._ilstBox
			.getQuickTimeDataBoxes(boxType)
			.filter((b) => NumberUtils.hasFlag(b.flags, AppleDataBoxFlagType.ContainsText, true))
			.reduce((accum, b) => {
				if (b.text) {
					for (const text of b.text.split(";")) {
						ArrayUtils.safePush(accum, text.trim());
					}
				}

				return accum;
			}, []);
	}

	/**
	 * Gets the raw data of all boxes within this tag's ILST box of the given `boxType`, optionally
	 * matching the provided `flags
	 * @param boxType Type of box to search for
	 * @param flags Optional, box flags to search for. Defaults to
	 *     {@link AppleDataBoxFlagType.ContainsData}
	 * @returns ByteVector[] Raw contents of the matching boxes, `[]` if no matches are found.
	 */
	public getQuickTimeData(boxType: ByteVector, flags: AppleDataBoxFlagType = AppleDataBoxFlagType.ContainsData): ByteVector[] {
		return this._ilstBox
			.getQuickTimeDataBoxes(boxType)
			.filter((b) => NumberUtils.hasFlag(b.flags, flags, true))
			.map((b) => b.data);
	}

	/**
	 * Gets the text contents of the first box within this tag's ILST box that matches the provided
	 * `boxType`.
	 * @param boxType Type of the box to search for.
	 * @returns string Text contents of the first matching box. `undefined` if no matches are found
	 */
	public getFirstQuickTimeString(boxType: ByteVector): string {
		return this.getQuickTimeStrings(boxType)[0];
	}

	/**
	 * Gets the raw data contents of the first box within this tag's ILST box that matches the
	 * provided `boxType`, optionally matching `flags` and a predicate.
	 * @param boxType Type of box to search for
	 * @param flags Optional flags to match, defaults to {@link AppleDataBoxFlagType.ContainsData}
	 * @param predicate Optional additional criteria the box must match
	 * @returns ByteVector Raw data contents of the first matching box. `undefined` if no matches
	 *     are found
	 */
	public getFirstQuickTimeData(
		boxType: ByteVector,
		flags: AppleDataBoxFlagType = AppleDataBoxFlagType.ContainsData,
		predicate?: (d: ByteVector) => boolean,
	): ByteVector {
		const data = this.getQuickTimeData(boxType, flags);
		return predicate ? data.find(predicate) : data[0];
	}

	/**
	 * Stores the provided `dataStrings` in iTunes boxes with the provided MEAN and NAME strings.
	 * This replaces any existing boxes.
	 * @param meanString MEAN box contents to set
	 * @param nameString NAME box contents to set
	 * @param dataStrings Contents of the iTunes box to store. Use `[]` or `undefined` to clear
	 *     the existing contents and leave empty.
	 */
	public setItunesStrings(meanString: string, nameString: string, ...dataStrings: string[]): void {
		this._ilstBox.setItunesTagBoxes(meanString, nameString, dataStrings);
	}

	/**
	 * Stores the provided `data` in boxes with the provided box type. If `flags` are provided, the
	 * DATA boxes created to store `data` will have the `flags` applied to them. This replaces all
	 * existing boxes of the given type.
	 * @param boxType Type of the box to set
	 * @param data Data to store in the boxes
	 * @param flags Optional, flags to set on the DATA boxes
	 */
	public setQuickTimeData(boxType: ByteVector, data: ByteVector[], flags: AppleDataBoxFlagType = AppleDataBoxFlagType.ContainsData): void {
		const dataBoxes = data?.map((bv) => AppleDataBox.fromDataAndFlags(bv, flags));
		this._ilstBox.setQuickTimeBoxes(boxType, dataBoxes);
	}

	/**
	 * Stores the provided string in a box with the provided box type. This replaces all boxes of
	 * the given type with a single box containing the provided data.
	 * @param boxType Type of box to set
	 * @param dataString Contents to store in the box
	 */
	public setQuickTimeString(boxType: ByteVector, dataString: string): void {
		this.setQuickTimeStrings(boxType, dataString ? [dataString] : undefined);
	}

	/**
	 * Stores the provided strings in boxes with the provided box type. This replaces all boxes of
	 * the given type with a single box of the given type containing a DATA box for each of the
	 * provided `dataStrings`.
	 * @param boxType Type of box to set
	 * @param dataStrings Contents to store in the box
	 */
	public setQuickTimeStrings(boxType: ByteVector, dataStrings: string[]): void {
		let dataBoxes: AppleDataBox[];
		if (!ArrayUtils.isFalsyOrEmpty(dataStrings)) {
			const joinedStrings = dataStrings.join("; ");
			dataBoxes = [AppleDataBox.fromDataAndFlags(ByteVector.fromString(joinedStrings, StringType.UTF8), AppleDataBoxFlagType.ContainsText)];
		}

		this._ilstBox.setQuickTimeBoxes(boxType, dataBoxes);
	}

	// #endregion

	/**
	 * Detaches the internal "ilst" box from its parent element.
	 * @internal
	 */
	public detachIlst(): void {
		this._metaBox.removeChildByBox(this._ilstBox);
	}

	private setFractionalNumber(boxType: ByteVector, numerator: number, denominator: number): void {
		Guards.uint(numerator, "numerator");
		Guards.uint(denominator, "denominator");

		const data =
			numerator === 0 && denominator === 0
				? undefined
				: [ByteVector.concatenate(0x00, 0x00, ByteVector.fromUshort(numerator), ByteVector.fromUshort(denominator), 0x00, 0x00)];
		this.setQuickTimeData(boxType, data);
	}
}
