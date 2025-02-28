import { ByteVector } from "../byteVector";
import { CorruptFileError } from "../errors";
import { IVideoCodec, MediaTypes } from "../properties";
import { Guards, NumberUtils } from "../utils";

/**
 * This class provides a representation of a Microsoft BitmapInfoHeader structure which provides
 * information about the dimensions and color format of a device-independent bitmap.
 * @link https://docs.microsoft.com/en-us/windows/win32/api/wingdi/ns-wingdi-bitmapinfoheader
 */
export default class RiffBitmapInfoHeader implements IVideoCodec {
	/**
	 * List of well known FOURCC codes and what they correspond to.
	 * @remarks
	 *     This list was cobbled together using
	 *     * The original .NET source
	 *     * https://omiod.com/codec/list.php
	 *     * https://www.fourcc.org/
	 *     * http://abcavi.kibi.ru/fourcc.php
	 *     If any FOURCCs are missing or wrong, submit a PR and include a link to some source saying
	 *     this FOURCC exists.
	 */
	public static readonly FOURCC_CODES: Map<number, string> = new Map<number, string>([
		/* BI_RGB */ [0x00000000, "Windows Bitmap Format"],
		/* BI_RLE8 */ [0x00000001, "Run length encoded 8bpp RGB Format"],
		/* BI_RLE4 */ [0x00000002, "Run length encoded 4bpp RGB Format"],
		/* BI_BITFIELDS */ [0x00000003, "Raw RGB Format using Bitmasks"],
		/* 1978 */ [0x31393738, "A.M.Paredes predictor (LossLess)"],
		/* 26LT */ [0x32364c54, "Discreet UC YUV 4:2:2:4 10-bit"],
		/* 28DV */ [0x32384456, "Apple QuickTime DV (DVCPRO NTSC)"],
		/* 28SM */ [0x3238534d, "Apple Graphics (SMC) codec (256 color)"],
		/* 3IV0 */ [0x33495630, "MPEG4-based codec 3ivx"],
		/* 3IV1 */ [0x33495631, "MPEG4-based codec 3ivx"],
		/* 3IV2 */ [0x33495632, "MPEG4-based codec 3ivx"],
		/* 3IVD */ [0x33495644, "Microsoft MPEG-4 v3 / Doctored 3ivx DivX"],
		/* 3IVX */ [0x33495658, "MPEG4-based codec 3ivx"],
		/* 8BPS */ [0x38425053, "Apple QuickTime Planar RGB w/Alpha-channel"],
		/* AAS4 */ [0x41415334, "Autodesk Animator codec (RLE)"],
		/* AASC */ [0x41415343, "Autodesk Animator codec"],
		/* ABVB */ [0x41425642, "Avid ABVB / NuVista MJPEG w/Alpha-channel"],
		/* ABYR */ [0x41425952, "Kensington codec (low resolution, low frame rate (6fps) codec)"],
		/* ACTL */ [0x4143544c, "Streambox ACT-L2"],
		/* ADV1 */ [0x41445631, "Loronix WaveCodec"],
		/* ADVJ */ [0x4144564a, "Avid M-JPEG (aka AVRn)"],
		/* AEIK */ [0x4145494b, "Intel Indeo Video 3.2 (Vector Quantization)"],
		/* AEMI */ [0x41454d49, "Array VideoONE MPEG1-I capture"],
		/* AFLC */ [0x41464c43, "Autodesk Animator FLC (256 color)"],
		/* AFLI */ [0x41464c49, "Autodesk Animator FLI (256 color)"],
		/* AHDV */ [0x41484456, "CineForm 10-bit Visually Perfect HD (Wavelet)"],
		/* AJPG */ [0x414a5047, "22fps JPEG-based codec"],
		/* ALAC */ [0x414c4143, "Apple lossless audio"],
		/* ALPH */ [0x414c5048, "Ziracom Video"],
		/* AMPG */ [0x414d5047, "Array VideoONE MPEG w/Compression"],
		/* ANIM */ [0x414e494d, "Intel RDX"],
		/* AP41 */ [0x41503431, "AngelPotion Definitive / Hacked Microsoft MPEG-4 v3"],
		/* AP42 */ [0x41503432, "AngelPotion Definitive / Hacked Microsoft MPEG-4 v3"],
		/* ASLC */ [0x41534c43, "AlparySoft Lossless Codec"],
		/* ASV1 */ [0x41535631, "Asus Video V1"],
		/* ASV2 */ [0x41535632, "Asus Video V2"],
		/* ASVX */ [0x41535658, "Asus Video 2.0"],
		/* ATM4 */ [0x41544d34, "Ahead Nero Digital MPEG-4 Codec"],
		/* AUR2 */ [0x41555232, "AuraVision Aura 2"],
		/* AURA */ [0x41555241, "AuraVision Aura 1"],
		/* AUVX */ [0x41555658, "USH AUVX video codec"],
		/* AV1X */ [0x41563158, "Avid 1:1x (QuickTime)"],
		/* AVC1 */ [0x41564331, "H.264/MPEG-4 AVC"],
		/* AVD1 */ [0x31445641, "Avid DV (QuickTime)"],
		/* AVDJ */ [0x4a445641, "Avid Meridien JFIF w/Alpha-channel"],
		/* AVDN */ [0x4e445641, "Avid DNxHD (QuickTime)"],
		/* AVDV */ [0x56445641, "Avid DV"],
		/* AVI1 */ [0x31495641, "MainConcept Motion JPEG Codec"],
		/* AVI2 */ [0x32495641, "MainConcept Motion JPEG Codec"],
		/* AVID */ [0x44495641, "Avid Motion JPEG"],
		/* AVIS */ [0x53495641, "Alias for AviSynth"],
		/* AVMP */ [0x504d5641, "Avid IMX (QuickTime)"],
		/* AVRN */ [0x4e525641, "Avid Motion JPEG"],
		/* AVUI */ [0x49555641, "Avid Meridien Uncompressed w/Alpha-channel"],
		/* AVUP */ [0x50555641, "Avid 10-bit Packed (QuickTime)"],
		/* AYUV */ [0x56555941, "Packed YUV 4:4:4 Format"],
		/* AZPR */ [0x52505a41, "Apple QuickTime Video"],
		/* AZRP */ [0x50525a41, "Apple QuickTime Video"],
		/* BA81 */ [0x31384142, "Raw Bayer Format"],
		/* BHIV */ [0x56494842, "BeHere iVideo"],
		/* BINK */ [0x4b4e4942, "Bink Video (RAD Game Tools)"],
		/* BITM */ [0x4d544942, "Microsoft H.261"],
		/* BLOX */ [0x584f4c42, "Jan Jezabek BLOX MPEG Codec"],
		/* BLZ0 */ [0x305a4c42, "Blizzard Decoder Filter DivX"],
		/* BMV1 */ [0x31564d42, "MicroFirst Bitmap Video"],
		/* BT20 */ [0x30325442, "Conexant/Brooktree Prosumer MediaStream"],
		/* BTCV */ [0x56435442, "Conexant/Brooktree Composite Video"],
		/* BTVC */ [0x43565442, "Conexant Composite Video"],
		/* BW00 */ [0x30305742, "BergWave (Wavelet)"],
		/* BW10 */ [0x30315742, "Broadway MPEG Capture w/Compression"],
		/* BXBG */ [0x47425842, "BOXX BGR"],
		/* BXRG */ [0x47525842, "BOXX RGB"],
		/* BXY2 */ [0x32595842, "BOXX 10-bit YUV"],
		/* BXYV */ [0x56595842, "BOXX YUV"],
		/* BYR1 */ [0x31525942, "Raw Bayer Format"],
		/* BYR2 */ [0x32525942, "Raw Bayer Format"],
		/* CC12 */ [0x32314343, "Intel YUV12 / AuraVision Aura 2"],
		/* CDV5 */ [0x35564443, "Canopus SD50 / DVHD"],
		/* CDVC */ [0x43564443, "Canopus DV Codec"],
		/* CDVH */ [0x48564443, "Canopus SD50 / DVHD"],
		/* CFCC */ [0x43434643, "DPS Perception Motion JPEG"],
		/* CFHD */ [0x44484643, "CineForm 10-bit Visually Perfect HD (Wavelet)"],
		/* CGDI */ [0x49444743, "Microsoft Office 97 Camcorder Video"],
		/* CHAM */ [0x4d414843, "Winnov Caviara Champagne"],
		/* CJPG */ [0x47504a43, "Creative Video Blaster Webcam Go JPEG"],
		/* CLJR */ [0x524a4c43, "Cirrus Logic Packed YUV 4:1:1 Format"],
		/* CLLC */ [0x434c4c43, "Canopus LossLess"],
		/* CLPL */ [0x4c504c43, "Planer YUV Format"],
		/* CM10 */ [0x30314d43, "CyberLink MediaShow 1.0"],
		/* CMYK */ [0x4b594d43, "Common Data Format in Printing"],
		/* COL0 */ [0x304c4f43, "Microsoft MPEG-4 v3"],
		/* COL1 */ [0x314c4f43, "Microsoft MPEG-4 v3"],
		/* CPLA */ [0x414c5043, "Weitek 4:2:0 YUV planar"],
		/* CRAM */ [0x4d415243, "Microsoft Video 1"],
		/* CSCD */ [0x44435343, "CamStudio Lossless Codec"],
		/* CT10 */ [0x30315443, "CyberLink TalkingShow 1.0"],
		/* CTRX */ [0x58525443, "Citrix Scalable Video Codec"],
		/* CUVC */ [0x43565543, "Canopus HQ"],
		/* CVID */ [0x44495643, "Cinepak by SuperMac"],
		/* CWLT */ [0x544c5743, "Microsoft Color WLT DIB"],
		/* CXY1 */ [0x31595843, "Conexant Planer YUV 4:1:1 Format"],
		/* CXY2 */ [0x32595843, "Conexant Planar YUV 4:2:2 Format"],
		/* CYUV */ [0x56555943, "Creative Labs Packed YUV 4:2:2 Format"],
		/* CYUY */ [0x59555943, "ATI YUV"],
		/* D261 */ [0x31363244, "DEC H.261, 24-bit"],
		/* D263 */ [0x33363244, "DEC H.263, 24-bit"],
		/* DAVC */ [0x43564144, "Dicas MPEGable H.264 / MPEG-4 AVC"],
		/* DC25 */ [0x35324344, "MainConcept ProDV Codec"],
		/* DCAP */ [0x50414344, "Pinnacle DV25 Codec"],
		/* DCL1 */ [0x314c4344, "Data Connection Conferencing Codec"],
		/* DCL2 */ [0x324c4344, "Data Connection Conferencing Codec"],
		/* DCL3 */ [0x334c4344, "Data Connection Conferencing Codec"],
		/* DCL4 */ [0x344c4344, "Data Connection Conferencing Codec"],
		/* DCL5 */ [0x354c4344, "Data Connection Conferencing Codec"],
		/* DCT0 */ [0x30544344, "WniWni Codec"],
		/* DFSC */ [0x43534644, "DebugMode FrameServer VFW Codec"],
		/* DIV1 */ [0x31564944, "FFmpeg OpenDivX"],
		/* DIV2 */ [0x32564944, "Microsoft MPEG-4 v2"],
		/* DIV3 */ [0x33564944, "DivX 3 Low-Motion"],
		/* DIV4 */ [0x34564944, "DivX 3 Fast-Motion"],
		/* DIV5 */ [0x35564944, "DivX 5.0"],
		/* DIV6 */ [0x36564944, "DivX MPEG-4 / Microsoft MPEG-4 v3"],
		/* DIVX */ [0x58564944, "DivX 4.0+ / OpenDivX"],
		/* DJPG */ [0x47504a44, "Broadway 101 Motion JPEG codec"],
		/* DM4V */ [0x56344d44, "Dicas MPEGable MPEG-4"],
		/* DMB1 */ [0x31424d44, "Matrox Rainbow Runner Motion JPEG w/hardware compression"],
		/* DMB2 */ [0x32424d44, "Paradigm Motion JPEG"],
		/* DMK2 */ [0x324b4d44, "ViewSonic V36 PDA Video"],
		/* DP02 */ [0x32305044, "DynaPel MPEG-4"],
		/* DP16 */ [0x36315044, "YUV411 w/DPCM 6-bit compression"],
		/* DP18 */ [0x38315044, "YUV411 w/DPCM 8-bit compression"],
		/* DP26 */ [0x36325044, "YUV422 w/DPCM 6-bit compression"],
		/* DP28 */ [0x38325044, "YUV422 w/DPCM 8-bit compression"],
		/* DP96 */ [0x36395044, "YVU9 w/DPCM 6-bit compression"],
		/* DP98 */ [0x38395044, "YVU9 w/DPCM 8-bit compression"],
		/* DP9L */ [0x4c395044, "YVU9 w/DPCM 6-bit compression and thinned-out"],
		/* DPS0 */ [0x30535044, "DPS Reality Motion JPEG"],
		/* DPSC */ [0x43535044, "DPS PAR Motion JPEG"],
		/* DRWX */ [0x58575244, "Pinnacle DV25 Codec"],
		/* DSVD */ [0x44565344, "Microsoft DirectShow DV"],
		/* DTMT */ [0x544d5444, "Media-100 Codec"],
		/* DTNT */ [0x544e5444, "Media-100 Codec"],
		/* DUCK */ [0x4b435544, "Duck TrueMotion S"],
		/* DV10 */ [0x30315644, "BlueFish444 Lossless RGBA, YUV 10-bit"],
		/* DV25 */ [0x35325644, "Matrox DVCPRO codec"],
		/* DV50 */ [0x30355644, "Matrox DVCPRO50 codec"],
		/* DVAN */ [0x4e415644, "Pinnacle miroVideo DV300 SW-only codec"],
		/* DVCP */ [0x50435644, "Apple QuickTime DV (DVCPRO PAL)"],
		/* DVCS */ [0x53435644, "MainConcept DV Codec"],
		/* DVE2 */ [0x32455644, "Insoft DVE-2 Videoconferencing Codec"],
		/* DVH1 */ [0x31485644, "Pinnacle DVHD100"],
		/* DVHD */ [0x44485644, "DV 1125 lines at 30.00 Hz or 1250 lines at 25.00 Hz"],
		/* DVIS */ [0x53495644, "VSYNC DualMoon Iris DV codec"],
		/* DVLP */ [0x504c5644, "Radius SoftDV 16:9 PAL"],
		/* DVMA */ [0x414d5644, "Darim Vision DVMPEG"],
		/* DVNM */ [0x4d4e5644, "Matsushita/Panasonic Video"],
		/* DVOR */ [0x524f5644, "BlueFish444 Lossless RGBA, YUC 10-bit"],
		/* DVPN */ [0x4e505644, "Apple QuickTime DV NTSC"],
		/* DVPP */ [0x50505644, "Apple QuickTime DV PAL"],
		/* DVR1 */ [0x31525644, "TARGA2000 Codec"],
		/* DVRS */ [0x53525644, "VSYNC DualMoon Iris DV codec"],
		/* DVSD */ [0x44535644, "DV 525 lines at 29.97 Hz or 625 lines at 25.00 Hz"],
		/* DVSL */ [0x4c535644, "DV compressed in SD"],
		/* DVX1 */ [0x31585644, "Lucent DVX1000SP Video Decoder"],
		/* DVX2 */ [0x32585644, "Lucent DVX2000S Video Decoder"],
		/* DVX3 */ [0x33585644, "Lucent DVX3000S Video Decoder"],
		/* DX50 */ [0x30355844, "DivX 5.0"],
		/* DXGM */ [0x4d475844, "EA Game Video Codec / Lord of the Rings Game Movies"],
		/* DXSB */ [0x42535844, "DivX Subtitles Codec"],
		/* DXT1 */ [0x31545844, "DirectX Compressed Texture w/1-bit alpha-channel)"],
		/* DXT2 */ [0x32545844, "DirectX Compressed Texture"],
		/* DXT3 */ [0x33545844, "DirectX Compressed Texture w/4-bit alpha-channel)"],
		/* DXT4 */ [0x34545844, "DirectX Compressed Texture"],
		/* DXT5 */ [0x35545844, "DirectX Compressed Texture w/3-bit alpha channel and interpolation)"],
		/* DXTC */ [0x43545844, "DirectX Texture Compression"],
		/* DXTN */ [0x4e545844, "DirectX Compressed Texture (DXTn)"],
		/* EKQ0 */ [0x30514b45, "Elsa Graphics Card Quick Codec"],
		/* ELK0 */ [0x304b4c45, "Elsa Graphics Card Codec"],
		/* EM2V */ [0x56324d45, "Etymonix MPEG-2 I-frame"],
		/* EMWC */ [0x43574d45, "EverAd Marquee WMA codec"],
		/* EQK0 */ [0x304b5145, "Elsa graphics card quick codec"],
		/* ES07 */ [0x37305345, "Eyestream 7 Codec"],
		/* ESCP */ [0x50435345, "*|Escape|Eidos Technologies Escape codec"],
		/* ETV1 */ [0x31565445, "eTreppid Video Codec"],
		/* ETV2 */ [0x32565445, "eTreppid Video Codec"],
		/* ETVC */ [0x43565445, "eTreppid Video Codec"],
		/* FFDS */ [0x53444646, "FFDShow supported"],
		/* FFV1 */ [0x31564646, "FFDShow Lossless video Codec"],
		/* FFVH */ [0x48564646, "FFDShow FFVH Codec"],
		/* FLIC */ [0x43494c46, "Autodesk FLI / FLC Animation|Autodesk FLI/FLC Animation"],
		/* FLJP */ [0x504a4c46, "D-Vision Field Encoded Motion JPEG w/LSI"],
		/* FLV1 */ [0x31564c46, "FFDShow FLV1 codec"],
		/* FMJP */ [0x504a4d46, "D-Vision field-based ISO MJPEG"],
		/* FMP4 */ [0x34504d46, "FFMpeg MPEG-4"],
		/* FMVC */ [0x43564d46, "Fox Magic Software Screen Capture Codec"],
		/* FPS1 */ [0x31535046, "Fraps Codec"],
		/* FRLE */ [0x454c5246, "SoftLab-NSK Y16 + Alpha RLE"],
		/* FRWA */ [0x41575246, "SoftLab-NSK Vision Forward Motion JPEG w/alpha-channel"],
		/* FRWD */ [0x44575246, "SoftLab-NSK Vision Forward Motion JPEG"],
		/* FRWT */ [0x54575246, "SoftLab-NSK Vision Forward Motion JPEG w/alpha-channel"],
		/* FRWU */ [0x55575246, "SoftLab-NSK Vision Forward Uncompressed"],
		/* FVF1 */ [0x31465646, "Iterated Systems Fractal Video Frame"],
		/* FVFW */ [0x57465646, "XviD-based FFMpeg MPEG-4 codec"],
		/* FXT1 */ [0x31545846, "3dfx Video"],
		/* GEOX */ [0x584f4547, "GEOMEPG4"],
		/* GEPJ */ [0x4a504547, "White Pine/Paradigm Matrix Motion JPEG Codec"],
		/* GJPG */ [0x47504a47, "Grand Tech GT891x Codec"],
		/* GLCC */ [0x43434c47, "GigaLink AV Capture codec"],
		/* GLZW */ [0x575a4c47, "Motion LZW"],
		/* GPEG */ [0x47455047, "Motion JPEG w/Floating Point"],
		/* GPJM */ [0x4d4a5047, "Pinnacle ReelTime Motion JPEG Codec"],
		/* GREY */ [0x59455247, "Packed YUV Monochrome Format"],
		/* GWLT */ [0x544c5747, "Microsoft Greyscale WLT DIB"],
		/* H260 */ [0x30363248, "Intel ITU H.260"],
		/* H261 */ [0x31363248, "Intel ITU H.261"],
		/* H262 */ [0x32363248, "Intel ITU H.262"],
		/* H263 */ [0x33363248, "Intel ITU H.263"],
		/* H264 */ [0x34363248, "Intel ITU H.264"],
		/* H265 */ [0x35363248, "Intel ITU H.265"],
		/* H266 */ [0x36363248, "Intel ITU H.266"],
		/* H267 */ [0x37363248, "Intel ITU H.267"],
		/* H268 */ [0x38363248, "Intel ITU H.268"],
		/* H269 */ [0x39363248, "Intel ITU H.263 for POTS-based videoconferencing"],
		/* HD10 */ [0x30314448, "BlueFish444 Lossless RGBA, YUC 10-bit"],
		/* HDX4 */ [0x34584448, "Jomigo HDX4"],
		/* HDYC */ [0x43594448, "Packed YUV 4:2:2 Format"],
		/* HEVC */ [0x43564548, "H.265/HEVC"],
		/* HFYU */ [0x55594648, "Huffman Lossless Codec"],
		/* HMCR */ [0x52434d48, "Rendition Motion Compensation Format"],
		/* HMRR */ [0x52524d48, "Rendition Motion Compensation Format"],
		/* I263 */ [0x33363249, "Intel ITU H.263"],
		/* I420 */ [0x30323449, "Planar YUV Format"],
		/* ICLB */ [0x424c4349, "InSoft CellB Videoconferencing Codec"],
		/* IDM0 */ [0x304d4449, "IDM Motion Wavelets 2.0"],
		/* IF09 */ [0x39304649, "Planar YUV Format"],
		/* IGOR */ [0x524f4749, "CyberLink PowerDVD"],
		/* IJLV */ [0x564c4a49, "Intel JPEG Library Video Codec"],
		/* IJPG */ [0x47504a49, "Intergraph JPEG"],
		/* ILVC */ [0x43564c49, "Intel Layered Video"],
		/* ILVR */ [0x52564c49, "ITU H.263+ Codec"],
		/* IMAC */ [0x43414d49, "Intel Hardware Motion Compensation"],
		/* IMC1 */ [0x31434d49, "Planar YUV Format"],
		/* IMC2 */ [0x32434d49, "Planar YUV Format"],
		/* IMC3 */ [0x33434d49, "Planar YUV Format"],
		/* IMC4 */ [0x34434d49, "Planar YUV Format"],
		/* IMJG */ [0x474a4d49, "Accom SphereOUS Motion JPEG w/Alpha-channel"],
		/* IPDV */ [0x56445049, "Giga AVI DV Codec"],
		/* IPJ2 */ [0x324a5049, "ImagePower Motion JPEG2000"],
		/* IPMA */ [0x414d5049, "Imagination Pilots IPMA Codec"],
		/* IR21 */ [0x31325249, "Intel Indeo 2.1"],
		/* IRAW */ [0x57415249, "Intel Packed Uncompressed YUV Format"],
		/* ISME */ [0x454d5349, "Intel's next-generation video codec"],
		/* IUYV */ [0x56595549, "Lead Technologies Packed Interlaced YUV 4:2:2 Format"],
		/* IV30 */ [0x30335649, "Intel Indeo Video 3"],
		/* IV31 */ [0x31335649, "Intel Indeo Video 3.1"],
		/* IV32 */ [0x32335649, "Intel Indeo Video 3.2"],
		/* IV33 */ [0x33335649, "Intel Indeo Video 3.3"],
		/* IV34 */ [0x34335649, "Intel Indeo Video 3.4"],
		/* IV35 */ [0x35335649, "Intel Indeo Video 3.5"],
		/* IV36 */ [0x36335649, "Intel Indeo Video 3.6"],
		/* IV37 */ [0x37335649, "Intel Indeo Video 3.7"],
		/* IV38 */ [0x38335649, "Intel Indeo Video 3.8"],
		/* IV39 */ [0x39335649, "Intel Indeo Video 3.9"],
		/* IV40 */ [0x30345649, "Intel Indeo Video 4.0"],
		/* IV41 */ [0x31345649, "Intel Indeo Video 4.1"],
		/* IV42 */ [0x32345649, "Intel Indeo Video 4.2"],
		/* IV43 */ [0x33345649, "Intel Indeo Video 4.3"],
		/* IV44 */ [0x34345649, "Intel Indeo Video 4.4"],
		/* IV45 */ [0x35345649, "Intel Indeo Video 4.5"],
		/* IV46 */ [0x36345649, "Intel Indeo Video 4.6"],
		/* IV47 */ [0x37345649, "Intel Indeo Video 4.7"],
		/* IV48 */ [0x38345649, "Intel Indeo Video 4.8"],
		/* IV49 */ [0x39345649, "Intel Indeo Video 4.9"],
		/* IV50 */ [0x30355649, "Intel Indeo Video 5.0"],
		/* IY41 */ [0x31345949, "Lead Technologies Packed, Interlaced YUV 4:1:1"],
		/* IYU1 */ [0x31555949, "IEEE 1394 Digital Camera 1.04 Mode 2 Packed YUV 4:1:1 Format"],
		/* IYU2 */ [0x32555949, "IEEE 1394 Digital Camera 1.04 Mode 0 Packed YUV 4:4:4 Format"],
		/* IYUV */ [0x56555949, "Planar YUV Format"],
		/* JBYR */ [0x5259424a, "Kensington Video Codec"],
		/* JFIF */ [0x4649464a, "FFMpeg Motion JPEG"],
		/* JPEG */ [0x4745504a, "Microsoft Still Image JPEG DIB"],
		/* JPGL */ [0x4c47504a, "Pegasus Lossless Motion JPEG / DIVIO JPEG Light"],
		/* KMVC */ [0x43564d4b, "Karl Morton's Video Codec"],
		/* KPCD */ [0x4443504b, "Kodak Photo CD"],
		/* L261 */ [0x3136324c, "Lead Technologies H.261"],
		/* L263 */ [0x3336324c, "Lead Technologies H.263"],
		/* LAGS */ [0x5347414c, "Lagarith LossLess"],
		/* LBYR */ [0x5259424c, "Creative WebCam Codec"],
		/* LCMW */ [0x574d434c, "Lead Technologies Motion CMW Codec"],
		/* LCW2 */ [0x3257434c, "Lead Technologies Tools MCMW 9Motion Wavelet)"],
		/* LEAD */ [0x4441454c, "Lead Technologies Proprietary MCMP compression"],
		/* LGRY */ [0x5952474c, "Lead Technologies Grayscale Image"],
		/* LIA1 */ [0x3141494c, "Liafail"],
		/* LJ11 */ [0x31314a4c, "Lead Technologies Motion JPEG 4:1:1"],
		/* LJ22 */ [0x32324a4c, "Lead Technologies Motion JPEG 4:2:2"],
		/* LJ2K */ [0x4b324a4c, "Lead Technologies Motion JPEG2000"],
		/* LJ44 */ [0x34344a4c, "Lead Technologies Motion JPEG 4:4:4"],
		/* LJPG */ [0x47504a4c, "Lead Technologies Motion JPEG Codec"],
		/* LMP2 */ [0x32504d4c, "Lead Technologies MPEG-2"],
		/* LMP4 */ [0x34504d4c, "Lead Technologies MPEG-4"],
		/* LOCO */ [0x4f434f4c, "LOCO Lossless Codec"],
		/* LSCR */ [0x5243534c, "Lead Technologies Screen Capture"],
		/* LSV0 */ [0x3056534c, "Infinop Inc. Video"],
		/* LSVC */ [0x4356534c, "Infinop Lightning Strike CBR Video Codec"],
		/* LSVM */ [0x4d56534c, "Vianet Lighting Strike Vmail (Streaming)"],
		/* LSVW */ [0x5756534c, "Infinop Lightning Strike MBR Video Codec"],
		/* LSVX */ [0x5856534c, "Infinop Lightning Strike MBR Video Codec"],
		/* LZO1 */ [0x314f5a4c, "Lempel-Ziv-Oberhumer Codec"],
		/* M101 */ [0x3130314d, "Matrox Uncompressed field-based YUY2"],
		/* M261 */ [0x3136324d, "Microsoft H.261"],
		/* M263 */ [0x3336324d, "Microsoft H.263"],
		/* M4CC */ [0x4343344d, "ESS MPEG4 Divio codec"],
		/* M4S2 */ [0x3253344d, "Microsoft MPEG-4 Video v1.1"],
		/* MC12 */ [0x3231434d, "ATI Motion Compensation Format"],
		/* MC24 */ [0x3432434d, "MainConcept Motion JPEG Codec"],
		/* MCAM */ [0x4d41434d, "ATI Motion Compensation Format"],
		/* MCZM */ [0x4d5a434d, "Theory MicroCosm Lossless 64-bit RGB w/Alpha-channel"],
		/* MDVD */ [0x4456444d, "Alex MicroDVD Video"],
		/* MDVF */ [0x4656444d, "Pinnacle DV / DV50 / DVHD100"],
		/* MHFY */ [0x5946484d, "A.M.Paredes mhuffyYUV (LossLess)"],
		/* MJ2C */ [0x43324a4d, "Morgan Multimedia Motion JPEG2000 w/Compression"],
		/* MJPA */ [0x41504a4d, "Pinnacle ReelTime Motion JPEG Hardware Codec"],
		/* MJPB */ [0x42504a4d, "Motion JPEG Codec"],
		/* MJPG */ [0x47504a4d, "Motion JPEG DIB Format"],
		/* MJPX */ [0x58504a4d, "Pegasus PICVideo Motion JPEG"],
		/* MMES */ [0x53454d4d, "Matrox MPEG-2 I-frame"],
		/* MMIF */ [0x46494d4d, "Matrox MPEG-2 elementary I-frame-only video stream"],
		/* MNVD */ [0x44564e4d, "MindBend MindVid LossLess"],
		/* MP2A */ [0x4132504d, "*|Media Excel MPEG-2 Audio"],
		/* MP2T */ [0x5432504d, "*|Media Excel MPEG-2 Transport Stream"],
		/* MP2V */ [0x5632504d, "*|Media Excel MPEG-2 Video"],
		/* MP41 */ [0x3134504d, "Microsoft MPEG-4 Windows Media Video"],
		/* MP42 */ [0x3234504d, "Microsoft MPEG-4 Windows Media Video"],
		/* MP43 */ [0x3334504d, "Microsoft MPEG-4 Windows Media Video"],
		/* MP4A */ [0x4134504d, "Media Excel MPEG-4 Audio"],
		/* MP4S */ [0x5334504d, "Microsoft MPEG-4 Windows Media 7"],
		/* MP4T */ [0x5434504d, "Media Excel MPEG-4 Transport Stream"],
		/* MP4V */ [0x5634504d, "Apple QuickTime MPEG-4 / FFmpeg MPEG-4 / Media Excel MPEG-4"],
		/* MPEG */ [0x4745504d, "Chromatic Research MPEG-1"],
		/* MPG1 */ [0x3147504d, "MPEG-1"],
		/* MPG2 */ [0x3247504d, "MPEG-2"],
		/* MPG3 */ [0x3347504d, "Microsoft MPEG-4 v3"],
		/* MPG4 */ [0x3447504d, "Microsoft MPEG-4 v1"],
		/* MPGI */ [0x4947504d, "Sigma Design MPEG-1 I-frame"],
		/* MPNG */ [0x474e504d, "Motion PNG Codec"],
		/* MRCA */ [0x4143524d, "FAST Multimedia MR Codec"],
		/* MRLE */ [0x454c524d, "Microsoft Run Length Encoding"],
		/* MSS1 */ [0x3153534d, "Microsoft Windows Media Screen v7"],
		/* MSS2 */ [0x3253534d, "Microsoft Windows Media Screen v9"],
		/* MSUC */ [0x4355534d, "MSU LossLess"],
		/* MSV1 */ [0x3156534d, "Microsoft Video Codec v1"],
		/* MSVC */ [0x4356534d, "Microsoft Video 1"],
		/* MSZH */ [0x485a534d, "Lossless Codec Library w/ZIP Compression"],
		/* MTGA */ [0x4147544d, "Motion TGA images (24, 32 bpp)"],
		/* MTX1 */ [0x3158544d, "Matrox Motion-JPEG codec"],
		/* MTX2 */ [0x3258544d, "Matrox Motion-JPEG codec"],
		/* MTX3 */ [0x3358544d, "Matrox Motion-JPEG codec"],
		/* MTX4 */ [0x3458544d, "Matrox Motion-JPEG codec"],
		/* MTX5 */ [0x3558544d, "Matrox Motion-JPEG codec"],
		/* MTX6 */ [0x3658544d, "Matrox Motion-JPEG codec"],
		/* MTX7 */ [0x3758544d, "Matrox Motion-JPEG codec"],
		/* MTX8 */ [0x3858544d, "Matrox Motion-JPEG codec"],
		/* MTX9 */ [0x3958544d, "Matrox Motion-JPEG codec"],
		/* MV12 */ [0x3231564d, "Motion Pixels Codec"],
		/* MVC9 */ [0x3943564d, "Nokia MVC video codec"],
		/* MVI1 */ [0x3149564d, "Motion Pixels MVI"],
		/* MVI2 */ [0x3249564d, "Motion Pixels MVI"],
		/* MWV1 */ [0x3156574d, "Aware Motion Wavelets"],
		/* MYUV */ [0x5655594d, "Media-100 844/X Uncompressed"],
		/* NAVI */ [0x4956414e, "nAVI Video Codec"],
		/* NDIG */ [0x4749444e, "Ahead Nero Digital MPEG-4 Codec"],
		/* NDSC */ [0x4353444e, "Nero Digital Codec"],
		/* NDSM */ [0x4d53444e, "Nero Digital MPEG-4"],
		/* NDSP */ [0x5053444e, "Unknown MPEG-4 Codec"],
		/* NDSS */ [0x5353444e, "Nero Digital MPEG-4"],
		/* NDXC */ [0x4358444e, "Nero Digital H.264"],
		/* NDXH */ [0x4858444e, "Nero Digital H.264"],
		/* NDXP */ [0x5058444e, "Nero Digital H.264"],
		/* NDXS */ [0x5358444e, "Nero Digital H.264"],
		/* NHVU */ [0x5556484e, "NVidia GEForce 3 Texture Format"],
		/* NI24 */ [0x3432494e, "Harmonic/Omneon Spectrum Codec"],
		/* NO16 */ [0x36314f4e, "Theory None16 64-bit Uncompressed RAW"],
		/* NT00 */ [0x3030544e, "NewTek LightWave HDTV YUV w/Alpha-channel"],
		/* NTN1 */ [0x314e544e, "Nogatech Video Compression 1"],
		/* NTN2 */ [0x324e544e, "Nogatech Video Compression 2 / GrabBee Hardware Coder"],
		/* NTSC */ [0x4353544e, "Radius SoftDV 16:9 NTSC"],
		/* NUV1 */ [0x3156554e, "NuppelVideo"],
		/* NV12 */ [0x3231564e, "Planar YUV Format"],
		/* NV21 */ [0x3132564e, "Planar YUV Format"],
		/* NVDS */ [0x5344564e, "NVidia Texture Format"],
		/* NVHS */ [0x5348564e, "NVidia GEForce 3 Texture Format"],
		/* NVS0 */ [0x3053564e, "nVidia Texture Compression Format"],
		/* NVS1 */ [0x3153564e, "nVidia Texture Compression Format"],
		/* NVS2 */ [0x3253564e, "nVidia Texture Compression Format"],
		/* NVS3 */ [0x3353564e, "nVidia Texture Compression Format"],
		/* NVS4 */ [0x3453564e, "nVidia Texture Compression Format"],
		/* NVS5 */ [0x3553564e, "nVidia Texture Compression Format"],
		/* NVT0 */ [0x3054564e, "nVidia Texture Compression Format"],
		/* NVT1 */ [0x3154564e, "nVidia Texture Compression Format"],
		/* NVT2 */ [0x3254564e, "nVidia Texture Compression Format"],
		/* NVT3 */ [0x3354564e, "nVidia Texture Compression Format"],
		/* NVT4 */ [0x3454564e, "nVidia Texture Compression Format"],
		/* NVT5 */ [0x3554564e, "nVidia Texture Compression Format"],
		/* NY12 */ [0x3231594e, "Nogatech YUV 12-bpp format"],
		/* NYUV */ [0x5655594e, "Nogatech YUV 4:2:2 format"],
		/* PCL2 */ [0x324c4350, "Pinnacle RL video codec"],
		/* PCLE */ [0x454c4350, "Pinnacle Studio 400 video codec"],
		/* PDVC */ [0x43564450, "Panasonic DVC Codec"],
		/* PGVV */ [0x56564750, "Radius Video Vision Telecast"],
		/* PHMO */ [0x4f4d4850, "IBM Photomotion"],
		/* PIM1 */ [0x314d4950, "Pinnacle DC1000 MPEG-1 w/Compression"],
		/* PIM2 */ [0x324d4950, "Pegasus Imaging / Pinnacle DC1000"],
		/* PIMJ */ [0x4a4d4950, "Pegasus Lossless Motion JPEG"],
		/* PIXL */ [0x4c584950, "MiroVideo XL Motion JPEG"],
		/* PJPG */ [0x47504a50, "Non-standard Motion JPEG"],
		/* PNG1 */ [0x31474e50, "Corecodec.org CorePNG Codec"],
		/* PVEZ */ [0x5a455650, "Horizons Technology PowerEZ Codec"],
		/* PVMM */ [0x4d4d5650, "PacketVideo Corporation MPEG-4"],
		/* PVW2 */ [0x32575650, "Pegasus Wavelet2000 w/Compression"],
		/* PVWV */ [0x56575650, "Pegasus Wavelet2000"],
		/* PXLT */ [0x544c5850, "Apple Pixlet Codec"],
		/* QDGX */ [0x58474451, "Apple QuickDraw GX"],
		/* QPEG */ [0x47455051, "Q-Team QPEG v1.1"],
		/* QPEQ */ [0x51455051, "Q-Team QPEG v1.1"],
		/* R210 */ [0x30313252, "BlackMagic YUV (QuickTime)"],
		/* R411 */ [0x31313452, "Radius DV NTSC YUV"],
		/* R420 */ [0x30323452, "Radius DV PAL YUV"],
		/* RAVI */ [0x49564152, "GroupTRON ReferenceAVI Codec"],
		/* RGB1 */ [0x31424752, "Raw RGB 3:3:2"],
		/* RGB2 */ [0x32424752, "Windows Bitmap Format"],
		/* RGBA */ [0x41424752, "Raw RGB w/Alpha-channel"],
		/* RGBO */ [0x4f424752, "Raw RGB 5:5:5"],
		/* RGBP */ [0x50424752, "Raw RGB 5:6:5"],
		/* RGBQ */ [0x51424752, "Raw RGB 5:5:5 Big-endian"],
		/* RGBR */ [0x52424752, "Raw RGB 5:6:5 Big-endian"],
		/* RGBT */ [0x54424752, "Raw RGB w/Transparency"],
		/* RIVA */ [0x41564952, "NVidia Swizzled Texture Format"],
		/* RLE4 */ [0x34454c52, "Run length encoded 4bpp RGB Format"],
		/* RLE8 */ [0x38454c52, "Run length encoded 8bpp RGB Format"],
		/* RLND */ [0x444e4c52, "Roland Corporation Video"],
		/* RMP4 */ [0x34504d52, "REALmagic MPEG-4 Video Codec"],
		/* ROQV */ [0x56514f52, "Id RoQ File Video Decoder"],
		/* RPZA */ [0x415a5052, "Apple QuickTime Video 'Road Pizza'"],
		/* RT21 */ [0x31325452, "Intel Real Time Video"],
		/* RTV0 */ [0x30565452, "NewTek VideoToaster"],
		/* RUD0 */ [0x30445552, "Rududu Video Codec"],
		/* RV10 */ [0x30315652, "RealVideo Codec"],
		/* RV13 */ [0x33315652, "RealVideo Codec"],
		/* RV20 */ [0x30325652, "RealVideo G2"],
		/* RV30 */ [0x30335652, "RealVideo 8"],
		/* RV40 */ [0x30345652, "RealVideo 9"],
		/* S263 */ [0x33363253, "Sorenson Vision H.263"],
		/* S422 */ [0x32323453, "VideoCap C210 YUV 4:2:2"],
		/* SAN3 */ [0x334e4153, "DivX 3.11a)"],
		/* SCCD */ [0x44434353, "Luminositi SoftCam Codec"],
		/* SDCC */ [0x43434453, "Sun Digital Camera codec"],
		/* SEDG */ [0x47444553, "Samsung MPEG-4 codec"],
		/* SFMC */ [0x434d4653, "CrystalNet Surface Fitting Method Codec"],
		/* SHR0 */ [0x30524853, "BitJazz SheerVideo (realtime lossless)"],
		/* SHR1 */ [0x31524853, "BitJazz SheerVideo (realtime lossless)"],
		/* SHR2 */ [0x32524853, "BitJazz SheerVideo (realtime lossless)"],
		/* SHR3 */ [0x33524853, "BitJazz SheerVideo (realtime lossless)"],
		/* SHR4 */ [0x34524853, "BitJazz SheerVideo (realtime lossless)"],
		/* SHR5 */ [0x35524853, "BitJazz SheerVideo (realtime lossless)"],
		/* SHR6 */ [0x36524853, "BitJazz SheerVideo (realtime lossless)"],
		/* SHR7 */ [0x37524853, "BitJazz SheerVideo (realtime lossless)"],
		/* SJPG */ [0x47504a53, "CUseeMe Networks Codec"],
		/* SL25 */ [0x35324c53, "SoftLab-NSK DVCPRO"],
		/* SL50 */ [0x30354c53, "SoftLab-NSK DVCPRO50"],
		/* SLDV */ [0x56444c53, "SoftLab-NSK Forward DV Draw Codec"],
		/* SLIF */ [0x46494c53, "SoftLab-NSK MPEG2 I-frames"],
		/* SLMJ */ [0x4a4d4c53, "SoftLab-NSK Forward Motion JPEG"],
		/* SMK2 */ [0x324b4d53, "RAD Game Tools Smacker Video Codec"],
		/* SMKA */ [0x414b4d53, "RAD Game Tools Smacker Audio Codec"],
		/* SMP4 */ [0x34504d53, "Samsung VP-ms15 Digicam DivX Codec"],
		/* SMSC */ [0x43534d53, "Radius Proprietary Codec"],
		/* SMSD */ [0x44534d53, "Radius Proprietary Codec"],
		/* SMSV */ [0x56534d53, "WorldConnect VisualMail Wavelet Video"],
		/* SNOW */ [0x574f4e53, "SNOW Codec"],
		/* SP40 */ [0x30345053, "SunPlus YUV"],
		/* SP44 */ [0x34345053, "SunPlus Aiptek MegaCam Codec"],
		/* SP53 */ [0x33355053, "SunPlus Aiptek MegaCam Codec"],
		/* SP54 */ [0x34355053, "SunPlus Aiptek MegaCam Codec"],
		/* SP55 */ [0x35355053, "SunPlus Aiptek MegaCam Codec"],
		/* SP56 */ [0x36355053, "SunPlus Aiptek MegaCam Codec"],
		/* SP57 */ [0x37355053, "SunPlus Aiptek MegaCam Codec"],
		/* SP58 */ [0x38355053, "SunPlus Aiptek MegaCam Codec"],
		/* SPIG */ [0x47495053, "Radius Spigot"],
		/* SPLC */ [0x434c5053, "Splash Studios ACM Audio Codec"],
		/* SPRK */ [0x4b525053, "Sorenson Spark"],
		/* SQZ2 */ [0x325a5153, "Microsoft VXtreme Video Codec v2"],
		/* STVA */ [0x41565453, "ST CMOS Imager Data (Bayer)"],
		/* STVB */ [0x42565453, "ST CMOS Imager Data (Nudged Bayer)"],
		/* STVC */ [0x43565453, "ST CMOS Imager Data (Bunched)"],
		/* STVX */ [0x58565453, "ST CMOS Imager Data (Extended)"],
		/* STVY */ [0x59565453, "ST CMOS Imager Data (Extended w/Correction Data)"],
		/* SV10 */ [0x30315653, "Sorenson Media Video R1"],
		/* SV3M */ [0x4d335653, "Sorenson SV3 Module Decoder"],
		/* SVQ1 */ [0x31515653, "Sorenson Video"],
		/* SVQ3 */ [0x33515653, "Sorenson Video 3"],
		/* SWC1 */ [0x31435753, "MainConcept Motion JPEG Codec"],
		/* T420 */ [0x30323454, "Toshiba YUV 4:2:0"],
		/* THEO */ [0x4f454854, "FFVFW Supported Codec"],
		/* TIFF */ [0x46464954, "Apple TIFF w/Alpha-channel"],
		/* TIM2 */ [0x324d4954, "Pinnacle RAL DVI"],
		/* TLMS */ [0x534d4c54, "TeraLogic Motion Infraframe Codec A"],
		/* TLST */ [0x54534c54, "TeraLogic Motion Infraframe Codec B"],
		/* TM20 */ [0x30324d54, "Duck TrueMotion 2.0"],
		/* TM2A */ [0x41324d54, "Duck TrueMotion Archiver 2.0"],
		/* TM2X */ [0x58324d54, "Duck TrueMotion 2X"],
		/* TMIC */ [0x43494d54, "TeraLogic Motion Intraframe Codec 2"],
		/* TMOT */ [0x544f4d54, "Horizons Technology TrueMotion Video Compression"],
		/* TR20 */ [0x30325254, "Duck TrueMotion RT 2.0"],
		/* TRLE */ [0x454c5254, "Akula Alpha Pro Custom AVI (LossLess)"],
		/* TRON */ [0x4e4f5254, "GroupTRON ReferenceAVI Codec"],
		/* TSCC */ [0x43435354, "TechSmith Screen Capture Codec"],
		/* TV10 */ [0x30315654, "Tecomac Low-Bit Rate Codec"],
		/* TVJP */ [0x504a5654, "TrueVision Field Encoded Motion JPEG"],
		/* TVMJ */ [0x4a4d5654, "Truevision Targa Motion JPEG Hardware Codec"],
		/* TY0N */ [0x4e305954, "Tecomac Low-Bit Rate Codec"],
		/* TY2C */ [0x43325954, "Trident Decompression Driver"],
		/* TY2N */ [0x4e325954, "Trident Decompression Driver"],
		/* U263 */ [0x33363255, "UB Video StreamForce H.263"],
		/* UCOD */ [0x444f4355, "eMajix ClearVideo"],
		/* ULTI */ [0x49544c55, "IBM Ultimotion"],
		/* UMP4 */ [0x34504d55, "UB Video MPEG-4"],
		/* UYNV */ [0x564e5955, "NVidia Packed YUV 4:2:2 Format"],
		/* UYVP */ [0x50565955, "Packed YCbCr 4:2:2 Format"],
		/* UYVU */ [0x55565955, "SoftLab-NSK Forward YUV codec"],
		/* UYVY */ [0x59565955, "Packed YUV 4:2:2 Format"],
		/* V210 */ [0x30313256, "Packed YCrCb 4:2:2 Format"],
		/* V261 */ [0x31363256, "Lucent VX2000S Video Codec"],
		/* V422 */ [0x32323456, "Packed YUV 4:2:2 Format"],
		/* V655 */ [0x35353656, "Packed YUV 4:2:2 Format"],
		/* VBLE */ [0x454c4256, "MarcFD VBLE Lossless Codec"],
		/* VCR1 */ [0x31524356, "ATI VCR 1.0"],
		/* VCR2 */ [0x32524356, "ATI VCR 2.0"],
		/* VCR3 */ [0x33524356, "ATI VCR 3.0"],
		/* VCR4 */ [0x34524356, "ATI VCR 4.0"],
		/* VCR5 */ [0x35524356, "ATI VCR 5.0"],
		/* VCR6 */ [0x36524356, "ATI VCR 6.0"],
		/* VCR7 */ [0x37524356, "ATI VCR 7.0"],
		/* VCR8 */ [0x38524356, "ATI VCR 8.0"],
		/* VCR9 */ [0x39524356, "ATI VCR 9.0"],
		/* VCWV */ [0x56574356, "VideoCon wavelet"],
		/* VDCT */ [0x54434456, "VITEC Multimedia Video Maker Pro DIB"],
		/* VDOM */ [0x4d4f4456, "VDOnet VDOWave"],
		/* VDOW */ [0x574f4456, "VDOnet VDOLive H.263"],
		/* VDST */ [0x54534456, "VirtualDub Remote Frameclient ICM Driver"],
		/* VDTZ */ [0x5a544456, "Darim Vision VideoTizer YUV"],
		/* VGPX */ [0x58504756, "Alaris VideoGramPix Codec"],
		/* VIDM */ [0x4d444956, "DivX 5.0 Pro Supported Codec"],
		/* VIDS */ [0x53444956, "Vitec Multimedia YUV 4:2:2 Codec"],
		/* VIFP */ [0x50464956, "Virtual Frame API Codec"],
		/* VIV1 */ [0x31564956, "Vivo H.263"],
		/* VIV2 */ [0x32564956, "Vivo H.263"],
		/* VIVO */ [0x4f564956, "Vivo H.263"],
		/* VIXL */ [0x4c584956, "Miro MiroVideo XL Motion JPEG"],
		/* VJPG */ [0x47504a56, "Video Communication Systems"],
		/* VLV1 */ [0x31564c56, "VideoLogic Captivator Codec"],
		/* VP30 */ [0x30335056, "On2 VP3"],
		/* VP31 */ [0x31335056, "On2 VP3"],
		/* VP40 */ [0x30345056, "On2 TrueCast VP4"],
		/* VP50 */ [0x30355056, "On2 TrueCast VP5"],
		/* VP60 */ [0x30365056, "On2 TrueCast VP6"],
		/* VP61 */ [0x31365056, "On2 TrueCast VP6.1"],
		/* VP62 */ [0x32365056, "On2 TrueCast VP6.2"],
		/* VP70 */ [0x30375056, "On2 TrueMotion VP7"],
		/* VP80 */ [0x30385056, "On2 VP8"],
		/* VQC1 */ [0x31435156, "ViewQuest Codec 1"],
		/* VQC2 */ [0x32435156, "ViewQuest Codec 2"],
		/* VQJP */ [0x504a5156, "ViewQuest VQ630 Dual-Mode Digital Camera"],
		/* VQS4 */ [0x34535156, "ViewQuest VQ110 Digital Video Camera"],
		/* VR21 */ [0x31325256, "BlackMagic YUV"],
		/* VSSH */ [0x48535356, "Vanguard VSS H.264"],
		/* VSSV */ [0x56535356, "Vanguard VSS Codec Light"],
		/* VSSW */ [0x57535356, "VSS Wavelet Video Codec|Vanguard VSS H.264"],
		/* VTLP */ [0x504c5456, "Alaris VideoGramPixel Codec"],
		/* VX1K */ [0x4b315856, "Lucent VX1000S Video Codec"],
		/* VX2K */ [0x4b325856, "Lucent VX2000S Video Codec"],
		/* VXSP */ [0x50535856, "Lucent VX1000SP Video Codec"],
		/* VYU9 */ [0x39555956, "Planar YUV Format: 8-but Y plane followed by 8-bit 4x4 subsampled V and U planes"],
		/* VYUY */ [0x59555956, "ATI Packed YUV Format"],
		/* WBVC */ [0x43564257, "Winbond W9960 Codec"],
		/* WHAM */ [0x4d414857, "Microsoft Video 1"],
		/* WINX */ [0x584e4957, "Winnov Software Compression"],
		/* WJPG */ [0x47504a57, "Winbond Motion JPEG"],
		/* WMV1 */ [0x31564d57, "Microsoft Windows Media Video v7"],
		/* WMV2 */ [0x32564d57, "Microsoft Windows Media Video v8"],
		/* WMV3 */ [0x33564d57, "Microsoft Windows Media Video v9"],
		/* WMVA */ [0x41564d57, "Microsoft Windows Media Video v9 Advanced Profile"],
		/* WMVP */ [0x50564d57, "Microsoft Windows Media Video v9.1 Image"],
		/* WNIX */ [0x58494e57, "WniWni Codec"],
		/* WNV1 */ [0x31564e57, "Winnov Videum Hardware Compression"],
		/* WPY2 */ [0x32595057, "Winnov Video"],
		/* WRLE */ [0x454c5257, "Apple QuickTime BMP Codec"],
		/* WRPR */ [0x52505257, "VideoTools VideoServer Client Codec"],
		/* WVC1 */ [0x31435657, "Microsoft SMPTE VC1 Codec"],
		/* WVLT */ [0x544c5657, "IllusionHope Wavelet 9/7"],
		/* WZCD */ [0x44435a57, "CORE Co. Ltd. iScan"],
		/* WZDC */ [0x43445a57, "CORE Co. Ltd. iSnap"],
		/* X263 */ [0x33363258, "Xirlink H.263"],
		/* X264 */ [0x34363258, "XiWave GNU GPL H.264 Codec"],
		/* XJPG */ [0x47504a58, "Xirlink JPEG-like compressor"],
		/* XLV0 */ [0x30564c58, "NetXL XL Video Decoder"],
		/* XMPG */ [0x47504d58, "XING Editable MPEG"],
		/* XVID */ [0x44495658, "XviD MPEG-4 Codec"],
		/* XWV0 */ [0x30565758, "XiWave Video Codec"],
		/* XWV1 */ [0x31565758, "XiWave Video Codec"],
		/* XWV2 */ [0x32565758, "XiWave Video Codec"],
		/* XWV3 */ [0x33565758, "XiWave Xi-3 Video Codec"],
		/* XWV4 */ [0x34565758, "XiWave Video Codec"],
		/* XWV5 */ [0x35565758, "XiWave Video Codec"],
		/* XWV6 */ [0x36565758, "XiWave Video Codec"],
		/* XWV7 */ [0x37565758, "XiWave Video Codec"],
		/* XWV8 */ [0x38565758, "XiWave Video Codec"],
		/* XWV9 */ [0x39565758, "XiWave Video Codec"],
		/* XXAN */ [0x4e415858, "Origin Video Codec"],
		/* XYZP */ [0x505a5958, "Extended PAL Format XYZ Palette"],
		/* Y16  */ [0x58313620, "Packed YUV Greyscale Format"],
		/* Y211 */ [0x31313259, "Packed YUV Format"],
		/* Y216 */ [0x36313259, "Pinnacle TARGA CineWave YUV"],
		/* Y411 */ [0x31313459, "Packed YUV 4:1:1 Format"],
		/* Y41B */ [0x42313459, "Weitek Planar YUV 4:1:1 Format"],
		/* Y41P */ [0x50313459, "Packed YUV 4:1:1 Format"],
		/* Y41T */ [0x54313459, "Packed YUV 4:1:1 Format w/Transparency"],
		/* Y422 */ [0x32323459, "Packed YUV 4:2:2 Format"],
		/* Y42B */ [0x42323459, "Weitek Planar YUV 4:2:2 Format"],
		/* Y42T */ [0x54323459, "Packed YUV 4:2:2 Format w/Transparency"],
		/* Y444 */ [0x34343459, "IEEE 1394 24-bit YUV 4:4:4"],
		/* Y8   */ [0x59382020, "Packed/Planar YUV Monochrome Format"],
		/* Y800 */ [0x30303859, "Packed/Planar YUV Monochrome Format"],
		/* YC12 */ [0x32314359, "Intel YUV12 Codec"],
		/* YCCK */ [0x4b434359, "Uncompressed YCbCr Video w/Key Data"],
		/* YMPG */ [0x47504d59, "YMPEG Alpha"],
		/* YU12 */ [0x32315559, "ATI YV12 4:2:0 Planar"],
		/* YU92 */ [0x32395559, "Intel YUV Video"],
		/* YUNV */ [0x564e5559, "NVidia Packed YUV 4:2:2 Format"],
		/* YUV2 */ [0x32565559, "Packed YUV 4:2:2 Format"],
		/* YUV8 */ [0x38565559, "Winnov Caviar YUV8 Video"],
		/* YUV9 */ [0x39565559, "Intel Planar YUV Format"],
		/* YUVP */ [0x50565559, "Packed YCbCr 4:2:2 Extended Precision Format"],
		/* YUY2 */ [0x32595559, "Packed YUV 4:2:2 Format"],
		/* YUYP */ [0x50595559, "Evans & Sutherland YCbCr 4:2:2 Extended Precision Format"],
		/* YUYV */ [0x56595559, "Packed YUV 4:2:2 Format"],
		/* YV12 */ [0x32315659, "Planar YUV Format"],
		/* YV16 */ [0x36315659, "Planar YUV Format"],
		/* YV92 */ [0x32395659, "Intel Smart Video Recorder"],
		/* YVU9 */ [0x39555659, "Intel Planar YUV Format"],
		/* YVYU */ [0x55595659, "Packed YUV 4:2:2 Format"],
		/* ZLIB */ [0x42494c5a, "Lossless Codec Library w/zlib Compression"],
		/* ZMBV */ [0x56424d5a, "DoxBox Capture Codec"],
		/* ZPEG */ [0x4745505a, "Metheus Video Zipper"],
		/* ZPG4 */ [0x3447505a, "VoDeo Solutions Video"],
		/* ZYGO */ [0x4f47595a, "ZyGo Video Codec"],
		/* raw2 */ [0x32776173, "Raw, Uncompressed RGB Bitmap"],
	]);

	private readonly _bitCount: number;
	private readonly _colorsUsed: number;
	private readonly _compressionId: number;
	private readonly _height: number;
	private readonly _imageSize: number;
	private readonly _importantColors: number;
	private readonly _planes: number;
	private readonly _width: number;
	private readonly _xPixelsPerMeter: number;
	private readonly _yPixelsPerMeter: number;

	/**
	 * Constructs and initializes a new instance by reading the raw structure from a specified
	 * position in the provided {@link ByteVector}.
	 * @param data ByteVector containing the raw data structure
	 * @param offset Index into `data` where the raw bitmap info header begins. Must be a positive,
	 *     32-bit integer.
	 */
	public constructor(data: ByteVector, offset: number) {
		Guards.truthy(data, "data");
		Guards.uint(offset, "offset");
		if (offset + 40 > data.length) {
			throw new CorruptFileError("Expected at least 40 bytes for bitmap info header");
		}

		this._width = data.subarray(offset + 4, 4).toUint(false);
		this._height = data.subarray(offset + 8, 4).toUint(false);
		this._planes = data.subarray(offset + 12, 2).toUshort(false);
		this._bitCount = data.subarray(offset + 14, 2).toUshort(false);
		this._compressionId = data.subarray(offset + 16, 4).toUint(false);
		this._imageSize = data.subarray(offset + 20, 4).toUint(false);
		this._xPixelsPerMeter = data.subarray(offset + 24, 4).toUint(false);
		this._yPixelsPerMeter = data.subarray(offset + 28, 4).toUint(false);
		this._colorsUsed = data.subarray(offset + 32, 4).toUint(false);
		this._importantColors = data.subarray(offset + 36, 4).toUint(false);
	}

	// #region Properties

	/**
	 * Gets the number of bits per pixel (bpp). For uncompressed formats, this value is the average
	 * number of bits per pixel. For compressed formats, this value is the implied bit depth of the
	 * uncompressed image, after the image has been decoded.
	 */
	public get bitCount(): number {
		return this._bitCount;
	}

	/**
	 * Gets the number of color indices in the color table that are actually used by the bitmap.
	 */
	public get colorsUsed(): number {
		return this._colorsUsed;
	}

	/**
	 * Gets the compression ID for the image.
	 * @remarks
	 *     For compressed video and YUV formats, this is a FOURCC code, specified as a DWORD in
	 *     little-endian order. For more information, see
	 *     {@link https://docs.microsoft.com/en-us/windows/win32/directshow/fourcc-codes} and
	 *     {@link https://www.fourcc.org/fourcc.php}. For uncompressed RGB formats, the following
	 *     values are possible:
	 *     * `BI_RGB` = `0x00000000` => Uncompressed RGB
	 *     * `BI_BITFIELDS` = `0x00000003` => Uncompressed RGB with color masks, valid for 16 and
	 *       32 bpp bitmaps.
	 *
	 *     {@link description} makes a best-guess attempt to determine the name of the compression
	 *     codec used.
	 */
	public get compressionId(): number {
		return this._compressionId;
	}

	/** @inheritDoc */
	public get description(): string {
		// Get the string version of the FOURCC code
		const fourccString = String.fromCharCode(
			NumberUtils.uintAnd(this._compressionId, 0x000000ff),
			NumberUtils.uintAnd(this._compressionId, 0x0000ff00) >>> 8,
			NumberUtils.uintAnd(this._compressionId, 0x00ff0000) >>> 16,
			NumberUtils.uintAnd(this._compressionId, 0xff000000) >>> 24,
		);

		const compressionFormat = RiffBitmapInfoHeader.FOURCC_CODES.get(this._compressionId) || "Unknown Video Format";
		return `${compressionFormat} [${fourccString}]`;
	}

	/**
	 * @inheritDoc
	 * @remarks The duration is not known from the video codec in a RIFF format file.
	 */
	public get durationMilliseconds(): number {
		return 0;
	}

	/**
	 * Gets the size, in bytes, of the image. This can be set to 0 for uncompressed RGB bitmaps.
	 */
	public get imageSize(): number {
		return this._imageSize;
	}

	/**
	 * Gets the number of color indices that are considered important for displaying the bitmap. If
	 * this value is `0`, all colors are important.
	 */
	public get importantColors(): number {
		return this._importantColors;
	}

	/** @inheritDoc */
	public get mediaTypes(): MediaTypes {
		return MediaTypes.Video;
	}

	/**
	 * Gets the number of planes in the image. This value is pretty much universally set to 1.
	 */
	public get planes(): number {
		return this._planes;
	}

	/** @inheritDoc */
	public get videoHeight(): number {
		return this._height;
	}

	/** @inheritDoc */
	public get videoWidth(): number {
		return this._width;
	}

	/**
	 * Gets the horizontal resolution, in pixels per meter, of the target device for the bitmap.
	 */
	public get xPixelsPerMeter(): number {
		return this._xPixelsPerMeter;
	}

	/**
	 * Gets the vertical resolution, in pixels per meter, of the target device for the bitmap.
	 */
	public get yPixelsPerMeter(): number {
		return this._yPixelsPerMeter;
	}

	// #endregion
}
