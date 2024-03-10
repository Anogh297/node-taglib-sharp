/**
 * Descriptor Tags
 */
export enum DescriptorTag {
	Forbidden_00 = 0,
	ObjectDescrTag = 1,
	InitialObjectDescrTag = 2,
	ES_DescrTag = 3,
	DecoderConfigDescrTag = 4,
	DecSpecificInfoTag = 5,
	SLConfigDescrTag = 6,
	ContentIdentDescrTag = 7,
	SupplContentIdentDescrTag = 8,
	IPI_DescrPointerTag = 9,
	IPMP_DescrPointerTag = 10,
	IPMP_DescrTag = 11,
	QoS_DescrTag = 12,
	RegistrationDescrTag = 13,
	ES_ID_IncTag = 14,
	ES_ID_RefTag = 15,
	MP4_IOD_Tag = 16,
	MP4_OD_Tag = 17,
	IPL_DescrPointerRefTag = 18,
	ExtensionProfileLevelDescrTag = 19,
	profileLevelIndicationIndexDescrTag = 20,
	ReservedForFutureISOUse_15_TO_3F = 21,
	ContentClassificationDescrTag = 64,
	KeyWordDescrTag = 65,
	RatingDescrTag = 66,
	LanguageDescrTag = 67,
	ShortTextualDescrTag = 68,
	ExpandedTextualDescrTag = 69,
	ContentCreatorNameDescrTag = 70,
	ContentCreationDateDescrTag = 71,
	OCICreatorNameDescrTag = 72,
	OCICreationDateDescrTag = 73,
	SmpteCameraPositionDescrTag = 74,
	SegmentDescrTag = 75,
	MediaTimeDescrTag = 76,
	ReservedForFutureISOUseOCI = 77,
	IPMP_ToolsListDescrTag = 96,
	IPMP_ToolTag = 97,
	M4MuxTimingDescrTag = 98,
	M4MuxCodeTableDescrTag = 99,
	ExtSLConfigDescrTag = 100,
	M4MuxBufferSizeDescrTag = 101,
	M4MuxIdentDescrTag = 102,
	DependencyPointerTag = 103,
	DependencyMarkerTag = 104,
	M4MuxChannelDescrTag = 105,
	ReservedForFutureISO_6A_TO_BF = 106,
	UserPrivate = 192,
	Forbidden_FF = 255,
}
