//#region \0%23tanstack-start-server-fn-resolver
var manifest = {
	"038d145f9e0f2fc7deb5d774c689275e369c15a619a4098bc7ba48b9425491b3": {
		functionName: "deleteJournalist_createServerFn_handler",
		importer: () => import("./journalist.functions-B51-I-QO.js")
	},
	"03e56af06bac9556b433ca2c960715be210a02a6e76a33dd5ea6f6d79c24f055": {
		functionName: "getCategories_createServerFn_handler",
		importer: () => import("./taxonomy.functions-BAzvOQF8.js")
	},
	"04344fe1d3ab2fd1861f88f715beb7ef2db30b44e66ca36f7ba3e8404a815be0": {
		functionName: "generateBackupServer_createServerFn_handler",
		importer: () => import("./backup.functions-eBGYUJ8_.js")
	},
	"069cbb24882dfa4dfd6a2737fc931ba8108762e6eece4c0c926b3aba2a060164": {
		functionName: "initializeGitRepo_createServerFn_handler",
		importer: () => import("./deploy.functions-C0rgJZP5.js")
	},
	"0d3e907d8ae66780e1453f78ed08c9c482ba98198c822ff82e6767a06b7a2599": {
		functionName: "getTopTags_createServerFn_handler",
		importer: () => import("./taxonomy.functions-BAzvOQF8.js")
	},
	"0da83c6ba72d428ef4d313202f748761bb822abb6fd298a5d991a8378d21bf96": {
		functionName: "getCategoryData_createServerFn_handler",
		importer: () => import("./taxonomy.functions-BAzvOQF8.js")
	},
	"0f76d5daec30f22ed2b4abe100480ff9f820fe0691e971349d3d5b31af064c95": {
		functionName: "regeneratePublicUserId_createServerFn_handler",
		importer: () => import("./admin-users.functions-BS1WhxRV.js")
	},
	"132f222d6e1935b3f6006155b9fd26c2f4d9a8e0a1ac6a60d42ff35bbfcc5575": {
		functionName: "deleteComment_createServerFn_handler",
		importer: () => import("./comments.functions-CfzX1ASd.js")
	},
	"16ce89c2eb2fca21f96b4f6bba1222693de042ef4995a45331af6ff4fb932aae": {
		functionName: "submitWorkWithUs_createServerFn_handler",
		importer: () => import("./inbox.functions-DjBDZmrE.js")
	},
	"17ad32ca11729c5f8dffda03c1b99d6a512f4d059ddd194f58f3eef91d3a6485": {
		functionName: "clearAllCachesServer_createServerFn_handler",
		importer: () => import("./server-cache-CItVrBHz.js")
	},
	"193c637c04726fc8af0270a2acd76449d25527e0405be5a6b8ae2f6e31db82b5": {
		functionName: "saveAdminArticle_createServerFn_handler",
		importer: () => import("./articles.functions-BR0s-JF3.js")
	},
	"1ed9c4a97893eb88d8297b68440263087530e9a8bd8d5c2c63a6725dd1a7f7b6": {
		functionName: "getAdminArticles_createServerFn_handler",
		importer: () => import("./articles.functions-BR0s-JF3.js")
	},
	"1ef32f84e1de0f5e22e29eb24ba235da8be53f367660995e70160ae1013b1e13": {
		functionName: "adminApproveJournalistApplication_createServerFn_handler",
		importer: () => import("./inbox.functions-DjBDZmrE.js")
	},
	"1f78d7f578a6afa4f03a2d2bc26fcf60e865cac4f78ccc0a2b5d02cfe41e0c1c": {
		functionName: "fixBrokenLinkServer_createServerFn_handler",
		importer: () => import("./redirect-rules-CdqlcePF.js")
	},
	"242f7a281f1bd9c0156e0defdfa248b20daa2720f35e430daac740ec37792361": {
		functionName: "toggleAdminUserBan_createServerFn_handler",
		importer: () => import("./admin-users.functions-BS1WhxRV.js")
	},
	"2480919bc2e170d233713b1c2830944913d8799c4dcb5c1adeca1e419a19f7a6": {
		functionName: "getPendingClaimsServer_createServerFn_handler",
		importer: () => import("./pending-claims-g7wFhSS4.js")
	},
	"2728870d1d2a6ca869b49740daab9a7138ab559359a7149922ab6ef7fdee087e": {
		functionName: "importTags_createServerFn_handler",
		importer: () => import("./taxonomy.functions-BAzvOQF8.js")
	},
	"2b528109ae68caadb520b78d8504c061898b4465ebb34cde90c52d157753bde0": {
		functionName: "saveRedirectRulesServer_createServerFn_handler",
		importer: () => import("./redirect-rules-CdqlcePF.js")
	},
	"2c0b0242c5348aaf049db4f8d306cbd4e7bd491678e5a4656209a7b52c9c8038": {
		functionName: "adminDeleteInboxRequest_createServerFn_handler",
		importer: () => import("./inbox.functions-DjBDZmrE.js")
	},
	"2d84dc33d0d55e73323d721355f17c3b57fbabc53b5cbd8b1444ceaea4227d14": {
		functionName: "uploadMediaServer_createServerFn_handler",
		importer: () => import("./media.functions-DyuXdkBt.js")
	},
	"2fbc4bc91a8b91f84dda5db092625db5003a98c6e7237acd1fb15e7efc1d8420": {
		functionName: "requestCurrentUserAccountDeletion_createServerFn_handler",
		importer: () => import("./auth.functions-4bbTCUen.js")
	},
	"30e470d9ce75c446d32d1443078c1a42c7b9fcddbe926b6e51d4512c60207ae8": {
		functionName: "generateArticleContentServer_createServerFn_handler",
		importer: () => import("./ai.functions-C0MAncQD.js")
	},
	"315817cf7049c35693ab4ae90f01139b3471377a5fba02601046ce0bfe6b9d72": {
		functionName: "getFontConfigServer_createServerFn_handler",
		importer: () => import("./font-config-CHoXA3Ea.js")
	},
	"3557b9ece7703e953e66289bb9ad0f4391b8d47ff6fdc4d5652e508a58f71699": {
		functionName: "getRecentArticlesForCommentsFn_createServerFn_handler",
		importer: () => import("./comments.functions-CfzX1ASd.js")
	},
	"35a302f18de1d0793e7e730eeef2831b0cc516d86513b175f171d21a439cfea8": {
		functionName: "saveJournalistRanksServer_createServerFn_handler",
		importer: () => import("./journalist-ranks-BRVOBGd0.js")
	},
	"3680d7ceec851db2d9971fd03a526ac19102d718a3bfc6d25320ac29524d8bdc": {
		functionName: "saveRewardsServer_createServerFn_handler",
		importer: () => import("./rewards-BOzIgQ9_.js")
	},
	"36d3e819f19ad290ee03e8f40f4d538efa60e4d071740ffcd196f321ea09dbac": {
		functionName: "deleteAdminUsersBulk_createServerFn_handler",
		importer: () => import("./admin-users.functions-BS1WhxRV.js")
	},
	"39a765bff09432b08654ad197bb7c4ff2cace5fec784cae9e7166ef73e28b0ba": {
		functionName: "getAdminDashboardStats_createServerFn_handler",
		importer: () => import("./articles.functions-BR0s-JF3.js")
	},
	"3a38e185b3779aeaabf8e39bee398139af011d9319629d9d39100c41c4bc0595": {
		functionName: "restoreBackupServer_createServerFn_handler",
		importer: () => import("./backup.functions-eBGYUJ8_.js")
	},
	"3b48b6e744f1a5c5ddc8bb4f3d6872f7099a6a2da7ab09a9160e985265508366": {
		functionName: "getCurrentUserRole_createServerFn_handler",
		importer: () => import("./auth.functions-4bbTCUen.js")
	},
	"3c25065a9854b8f41b454c04f5082fc4b0279d108c26242fe4b00da52ce9d501": {
		functionName: "adminApproveAccountDeletion_createServerFn_handler",
		importer: () => import("./inbox.functions-DjBDZmrE.js")
	},
	"3cfc9da0c530c5885b434a93a6cfd05899b6dc10d8625ddd679755011d2eaf88": {
		functionName: "generatePageSeoServer_createServerFn_handler",
		importer: () => import("./ai.functions-C0MAncQD.js")
	},
	"3f45f09c0a8c44c2e7fec139cc3fdb27d935e1757387119c458a56c601a5a3f0": {
		functionName: "generateDummyCommentsFn_createServerFn_handler",
		importer: () => import("./comments.ai-D4i45RuK.js")
	},
	"424c41ecfd6de125add850459642fbb101dfbf9443245c9923f618fb115e3edc": {
		functionName: "executeSetup_createServerFn_handler",
		importer: () => import("./setup.functions-CTfUx942.js")
	},
	"44648476b52f75748fa9e061f78c31dfe57f35f10cdf3043e81e50dfae452846": {
		functionName: "createAdminUser_createServerFn_handler",
		importer: () => import("./admin-users.functions-BS1WhxRV.js")
	},
	"44c2b244a154cd9bc6306696fd578a3756f03ae68ae423ffb59681668e80655c": {
		functionName: "getRolesServer_createServerFn_handler",
		importer: () => import("./roles-Dl3CHodB.js")
	},
	"456a04395d91d0c6af478600bc3d2d7698126db44c195a057c14f79bc2f06e8d": {
		functionName: "deleteTag_createServerFn_handler",
		importer: () => import("./taxonomy.functions-BAzvOQF8.js")
	},
	"476e6c8da3355fb484a63ca04ee5ea1bbcacbd52a31c6a14fa17a22de2226ba3": {
		functionName: "searchPublicArticles_createServerFn_handler",
		importer: () => import("./articles.functions-BR0s-JF3.js")
	},
	"48fe8cb020169719d3cd57f8962b6b1845ce528dab34e360f2be0bef0c3d06bc": {
		functionName: "importAdminUsers_createServerFn_handler",
		importer: () => import("./admin-users.functions-BS1WhxRV.js")
	},
	"494a2753d65953536e1f3934b3921e0f62393deb0838cc47539f0ea3de769dbd": {
		functionName: "deleteMediaServer_createServerFn_handler",
		importer: () => import("./media.functions-DyuXdkBt.js")
	},
	"4ef4526c7851016d95d34a2a71feba58eb4669c50021f14c2f9649d2bf686d9d": {
		functionName: "getSessionServer_createServerFn_handler",
		importer: () => import("./auth.functions-4bbTCUen.js")
	},
	"4fa6f5bc37fef053d73e12215a610604a3727a81c4d2685fff68092276b1b89b": {
		functionName: "getRewardsServer_createServerFn_handler",
		importer: () => import("./rewards-BOzIgQ9_.js")
	},
	"5171cfe7a5eb72c85b80892422db2c978d7f6ca631e43682141b0447064c407b": {
		functionName: "getMediaListServer_createServerFn_handler",
		importer: () => import("./media.functions-DyuXdkBt.js")
	},
	"54425a5416a220839e30a32e3d0173b5b44626cb9bacd7b67d8e4fe08ad48a44": {
		functionName: "checkSetupStatus_createServerFn_handler",
		importer: () => import("./setup.functions-CTfUx942.js")
	},
	"5654329e34be191256640c8957e4eaed33fcb574dfccb4b513f44c828b16863f": {
		functionName: "getRequestOrigin_createServerFn_handler",
		importer: () => import("./origin.functions-B1PGkcGu.js")
	},
	"565efeec1ab25fb57eae93f7945f8ef4ef742652c0a4b3bccc38842724bfecfb": {
		functionName: "deleteAdminArticle_createServerFn_handler",
		importer: () => import("./articles.functions-BR0s-JF3.js")
	},
	"5c8cf393ab6d7dc22b596958c14fc70206128b2d1b8f92272c11ce262e738bcb": {
		functionName: "saveRolesServer_createServerFn_handler",
		importer: () => import("./roles-Dl3CHodB.js")
	},
	"5e45b55e814da1ee45b2c220ed8509e0fc09d858adfa040131700cfd9259dc45": {
		functionName: "saveTag_createServerFn_handler",
		importer: () => import("./taxonomy.functions-BAzvOQF8.js")
	},
	"6060beafa123a3a81700b8cc4762dc17289432a963ce287cdd68e0b4630d7931": {
		functionName: "generateSectionHtmlServer_createServerFn_handler",
		importer: () => import("./ai.functions-C0MAncQD.js")
	},
	"64074aae210bf06c1f6dd880c1ceb389e454c17f09dc8077502ecd8f6d3d97f2": {
		functionName: "scanBrokenLinksServer_createServerFn_handler",
		importer: () => import("./redirect-rules-CdqlcePF.js")
	},
	"64423d826bbc714ede86951c9f1916f7f0b77d8d1a2f932f86789450e9b7f8b6": {
		functionName: "deleteAdminUser_createServerFn_handler",
		importer: () => import("./admin-users.functions-BS1WhxRV.js")
	},
	"65600bf083ec71d5df1045a46b6e8e2965c827f1fa1a8b147499ee9ddedc3bbe": {
		functionName: "setJournalistActive_createServerFn_handler",
		importer: () => import("./journalist.functions-B51-I-QO.js")
	},
	"692ea2f55d4ecec9ef0a88eea92718428ba0af1975105119862bde2e25106d67": {
		functionName: "getCustomPagesServer_createServerFn_handler",
		importer: () => import("./custom-pages-DCht8akj.js")
	},
	"69521f1e7392e34389c335e12d6c56785c32af5c1bcf47157ef32029c1829db4": {
		functionName: "updateAdminUserPassword_createServerFn_handler",
		importer: () => import("./admin-users.functions-BS1WhxRV.js")
	},
	"6c259ade959c851cd70340313263eb8505cc9ec3b200d13ef96c63eff4e5a00f": {
		functionName: "submitEventRegistration_createServerFn_handler",
		importer: () => import("./inbox.functions-DjBDZmrE.js")
	},
	"6ee862fc9a6e094cb784d2759dd3f559deb4caabd5b844a6255c1e2f7a255d25": {
		functionName: "upsertJournalist_createServerFn_handler",
		importer: () => import("./journalist.functions-B51-I-QO.js")
	},
	"7179a38770baf2cdf7e3286c4ecc116948c0125097a3a5e488afd664b1e90777": {
		functionName: "saveCustomPageServer_createServerFn_handler",
		importer: () => import("./custom-pages-DCht8akj.js")
	},
	"7236ee6b389af833d155a187ac4a91b3d68811b03e1a40085dd07cc06936564e": {
		functionName: "getPublicArchiveArticles_createServerFn_handler",
		importer: () => import("./articles.functions-BR0s-JF3.js")
	},
	"7338eb5a2878ffa1f7b6e110ac13a130cb2ca3445d5a5fa61817aeaa8b5c131c": {
		functionName: "updateCommentStatus_createServerFn_handler",
		importer: () => import("./comments.functions-CfzX1ASd.js")
	},
	"73da229e9bba97b2e3b47fcf9f861a6b89c3ec72511b4c8964a3e5c9e092b53d": {
		functionName: "deleteCategory_createServerFn_handler",
		importer: () => import("./taxonomy.functions-BAzvOQF8.js")
	},
	"77058d8bdc7833b6d17a992ddb7ca497890e6aa535436b00ec867be38d365b44": {
		functionName: "postArticleComment_createServerFn_handler",
		importer: () => import("./comments.functions-CfzX1ASd.js")
	},
	"7767b80dfc8a05617da49ed7b2fff2ef4cf1d9172125810f5a1bb8fe9159ac0f": {
		functionName: "signInServer_createServerFn_handler",
		importer: () => import("./auth.functions-4bbTCUen.js")
	},
	"77b55eb13ad368fb1b0873c8c532ac23b5668348efc4c34ac3c3e0915a03f702": {
		functionName: "getAdminComments_createServerFn_handler",
		importer: () => import("./comments.functions-CfzX1ASd.js")
	},
	"78f4c911acbdaabc3934ef25173a7247b252784ce0cec0a0d21a5c58599140db": {
		functionName: "getAllCommentsFn_createServerFn_handler",
		importer: () => import("./comments.functions-CfzX1ASd.js")
	},
	"7ae569f1f945df118a54485d2422ff53e4ee9dccc16c5867fc1b42c7b0cdcf34": {
		functionName: "submitDeleteAccountRequest_createServerFn_handler",
		importer: () => import("./inbox.functions-DjBDZmrE.js")
	},
	"7b186d766aa8c796c848f3fedb34e6679caf6d5177470f7bbe3fd7316adcf994": {
		functionName: "getCurrentUserProfile_createServerFn_handler",
		importer: () => import("./auth.functions-4bbTCUen.js")
	},
	"7bd773403e6cf1738bce63ecdf682bbfa435a41a857b4c398d398e6df9980a14": {
		functionName: "testDatabaseConnection_createServerFn_handler",
		importer: () => import("./setup.functions-CTfUx942.js")
	},
	"7cbf675c7bd7c9ee224e699588bfa7a4d7b38ac86b77a40ade5d857819ebe6a7": {
		functionName: "getRedirectRulesServer_createServerFn_handler",
		importer: () => import("./redirect-rules-CdqlcePF.js")
	},
	"7f3705a23943e0d335f1e588bc9def784ae013d70f854e527352bbe3e91d7b6c": {
		functionName: "setUserPoints_createServerFn_handler",
		importer: () => import("./admin-users.functions-BS1WhxRV.js")
	},
	"8582d48d00b8ab9f107f617c3221dc7d52eab78da86619d0241671b46381f893": {
		functionName: "saveHomepageConfigServer_createServerFn_handler",
		importer: () => import("./homepage-config-BbdU-QnL.js")
	},
	"85a69b0fa82aba24f7f596912ea912b9ee983194c4b1169716362810332f93cd": {
		functionName: "searchJournalists_createServerFn_handler",
		importer: () => import("./journalist.functions-B51-I-QO.js")
	},
	"867751394f3b0a32d0e5596bca686f87633494837852fe31aadabda10cc1fb52": {
		functionName: "saveAdConfigurationServer_createServerFn_handler",
		importer: () => import("./ads-storage-DvZEsAbQ.js")
	},
	"867f8fd34f32acecfe9ec627f5b33ef8762a5eabab40b2b297e14b09e6fd5382": {
		functionName: "getJournalistRanksServer_createServerFn_handler",
		importer: () => import("./journalist-ranks-BRVOBGd0.js")
	},
	"8a1c5ef143a372c0240b9c8c466dad42d616ff503a5362ba972f6f98c5b19b6e": {
		functionName: "getGitStatus_createServerFn_handler",
		importer: () => import("./deploy.functions-C0rgJZP5.js")
	},
	"8cea322cbc4f6bcc495d4f79eecafc364597765e92569763076616465537f853": {
		functionName: "listJournalists_createServerFn_handler",
		importer: () => import("./journalist.functions-B51-I-QO.js")
	},
	"8db4491881a2542e7ca906cd944acb38f7c8686c7b09435d2c0689601728de06": {
		functionName: "importAdminArticles_createServerFn_handler",
		importer: () => import("./articles.functions-BR0s-JF3.js")
	},
	"a11c92cd0221f09684c9d38d6e88a3645d06872fc73a4b7193f07e754240b401": {
		functionName: "getArticleComments_createServerFn_handler",
		importer: () => import("./comments.functions-CfzX1ASd.js")
	},
	"a2cd0096acae8fe7ede91a9dbfb5402cdc97389227b6119619b8779199a18708": {
		functionName: "adminGetInboxSummary_createServerFn_handler",
		importer: () => import("./inbox.functions-DjBDZmrE.js")
	},
	"a5ad24c30f372a03151c7dc3f1f8332cdb02d7e67e7bc64a72c494b6ce88400e": {
		functionName: "getDeployLog_createServerFn_handler",
		importer: () => import("./deploy.functions-C0rgJZP5.js")
	},
	"a6002267c4d192ba76a3c675b580d90351bd78a0e67a36f81933b37bd786cf2e": {
		functionName: "awardJournalistPoints_createServerFn_handler",
		importer: () => import("./journalist.functions-B51-I-QO.js")
	},
	"a747fffbbe483f1e7dd71777de6f5a0b47369156a453a555650c7cf2bb6719ef": {
		functionName: "buildProject_createServerFn_handler",
		importer: () => import("./deploy.functions-C0rgJZP5.js")
	},
	"a76ed6fe6d9e768c9b491e3918e54e2f3edbe342884378d0c60678bcca5b54fe": {
		functionName: "deleteAdStaticFilesServer_createServerFn_handler",
		importer: () => import("./ads-storage-DvZEsAbQ.js")
	},
	"a9524f219d84d7feedeb9446b2f236f589c9b507df590a19a028c57c50e8eddb": {
		functionName: "saveFontConfigServer_createServerFn_handler",
		importer: () => import("./font-config-CHoXA3Ea.js")
	},
	"aae3045fa12508107196bec8b35c12823003d4de5f5ee5ab44551e208a987c23": {
		functionName: "submitJournalistApplication_createServerFn_handler",
		importer: () => import("./inbox.functions-DjBDZmrE.js")
	},
	"afb7555d6a34adc5b0e662eb11f4a7f6971738589c83e37b63b29ef9bf924cb1": {
		functionName: "upgradeToPremiumServer_createServerFn_handler",
		importer: () => import("./roles-Dl3CHodB.js")
	},
	"b1b7c2049f9fd39ff484d5780be121d634dec8fc9387b4af69c0fc546d841511": {
		functionName: "submitWithdrawRequest_createServerFn_handler",
		importer: () => import("./inbox.functions-DjBDZmrE.js")
	},
	"b3095e70e29c64e8fdcdde5fbc447132d5211556bec99ac668eb0ff2de5657aa": {
		functionName: "saveCategory_createServerFn_handler",
		importer: () => import("./taxonomy.functions-BAzvOQF8.js")
	},
	"b5112734f93085547420b85a9164457598dbdbca42f9bad3acc9fdd652a1ce7f": {
		functionName: "adminGetInboxRequests_createServerFn_handler",
		importer: () => import("./inbox.functions-DjBDZmrE.js")
	},
	"b51eb31b9d36ce8ad6724bbbef81a5b0b5f0ee5403bd22eeb33f98d43c91fcfb": {
		functionName: "getTags_createServerFn_handler",
		importer: () => import("./taxonomy.functions-BAzvOQF8.js")
	},
	"b5d698999d02b005eeeb606cbdbd6f6d4fd0b8f52dd673d424fc0e7d35d91a8f": {
		functionName: "getUserServer_createServerFn_handler",
		importer: () => import("./auth.functions-4bbTCUen.js")
	},
	"b6036d0bc738454474507449abce75eb56abbf37fec319140f402be356cf4f37": {
		functionName: "getAllAdminUsers_createServerFn_handler",
		importer: () => import("./admin-users.functions-BS1WhxRV.js")
	},
	"b875846417bf76c2373ddaf3772e07ddd0648482764372fe11e47cddb10df762": {
		functionName: "getPublicArticleBySlug_createServerFn_handler",
		importer: () => import("./articles.functions-BR0s-JF3.js")
	},
	"ba730ab7529c25c3f6ecd56d5e41e85a92653f22b92925befe98d3ae9a58e52c": {
		functionName: "setAdminUserRole_createServerFn_handler",
		importer: () => import("./admin-users.functions-BS1WhxRV.js")
	},
	"bd28439ed241bc6457c20970b10c64e134f15e3bf56e42a335137a2728b7d7f2": {
		functionName: "getHomepageConfigServer_createServerFn_handler",
		importer: () => import("./homepage-config-BbdU-QnL.js")
	},
	"be945b3b1850d06957e0c1f1206a296f68186767b6bc3e5f7332ebab888698a4": {
		functionName: "getJournalistPrivateStats_createServerFn_handler",
		importer: () => import("./journalist.functions-B51-I-QO.js")
	},
	"c197567c90b8a1cde5691024f8c8cba20ff2582a13a5bad48a45cbc91f16fc6d": {
		functionName: "getProfileServer_createServerFn_handler",
		importer: () => import("./auth.functions-4bbTCUen.js")
	},
	"c1d937c34a7fb32d17695c2e775aa0d34df5549df8dda2ac848c787668183790": {
		functionName: "bulkToggleAdminUserBan_createServerFn_handler",
		importer: () => import("./admin-users.functions-BS1WhxRV.js")
	},
	"c45cee029994ab43bbe6ad2c83b81e99d5008c5b979f02b4994e34820d8fb69d": {
		functionName: "getDeployHistory_createServerFn_handler",
		importer: () => import("./deploy.functions-C0rgJZP5.js")
	},
	"c69cb5377cccba9eb185d48034cd36b39b797aad2b84bf3751285f58d3cdbcc7": {
		functionName: "getHomepageArticles_createServerFn_handler",
		importer: () => import("./articles.functions-BR0s-JF3.js")
	},
	"c78294774cd3e4bb1c4a1b90ba325c5a3e4378da96a7efd13255241950559fc2": {
		functionName: "getSiteSettingsServer_createServerFn_handler",
		importer: () => import("./site-settings-BtXkORbo.js")
	},
	"c8f150db49105e8920ef4f4b599173f2209d60195550f302cc89ed3133ecf7b6": {
		functionName: "adminUpdateInboxStatus_createServerFn_handler",
		importer: () => import("./inbox.functions-DjBDZmrE.js")
	},
	"cb6b8bf70884edd100e4ea383f633fbb54f6556775a50e424c5efbc73a7ba76d": {
		functionName: "deleteAllCommentsFn_createServerFn_handler",
		importer: () => import("./comments.functions-CfzX1ASd.js")
	},
	"cc59c9c287ab31b02d5dd933dfcae74b25340d1c5e5cf66e469416924854aa55": {
		functionName: "updateClaimStatusServer_createServerFn_handler",
		importer: () => import("./pending-claims-g7wFhSS4.js")
	},
	"ce1125864efa76115c34ea2a60564fcb9d798efd40778bdc464f77843b17ea5a": {
		functionName: "gitPull_createServerFn_handler",
		importer: () => import("./deploy.functions-C0rgJZP5.js")
	},
	"d11f8218e1bc2394af4f78dca0f87578d9aed581749b5a90533c8ba434f6b8d8": {
		functionName: "lookupJournalist_createServerFn_handler",
		importer: () => import("./journalist.functions-B51-I-QO.js")
	},
	"d296691172b6166ca20eee958357a08c2f40f1de3af5b5b23c9ab00dd920d54e": {
		functionName: "submitContactMessage_createServerFn_handler",
		importer: () => import("./inbox.functions-DjBDZmrE.js")
	},
	"d40db31842ef69c32ee11b885c847a349426926025e989432dc9f235693a7f8f": {
		functionName: "generateCategoryDescriptionServer_createServerFn_handler",
		importer: () => import("./ai.functions-C0MAncQD.js")
	},
	"d5830d251ab2f9747dda53ce45f1285e09274b9a75417b75378eaeb555e1b2f2": {
		functionName: "saveSiteSettingsServer_createServerFn_handler",
		importer: () => import("./site-settings-BtXkORbo.js")
	},
	"d6fff43b8c882c22c23d05f462c3d8a1e8d63e06f94d1c05315b49b296cd751b": {
		functionName: "updateAdminUserDetails_createServerFn_handler",
		importer: () => import("./admin-users.functions-BS1WhxRV.js")
	},
	"df8b16c859c7fd668587be4aacb40208f4cc4b6c8458c7a094215fd98e8e361f": {
		functionName: "signUpServer_createServerFn_handler",
		importer: () => import("./auth.functions-4bbTCUen.js")
	},
	"dfcb04800cdeb31e774b458dd497514b9ddeaa58e171298b91f1907be9a8c7b2": {
		functionName: "importCommentsFn_createServerFn_handler",
		importer: () => import("./comments.functions-CfzX1ASd.js")
	},
	"e10c1724b54a5d0e4ddc7f147e00f08845b00a2e41a59862625f5831cfba8629": {
		functionName: "getAdConfigurationServer_createServerFn_handler",
		importer: () => import("./ads-storage-DvZEsAbQ.js")
	},
	"e2f69f0542cf632edc163e1724bec5f208985dacb09a88cc9ae9e5807b50ece0": {
		functionName: "updateCurrentUserProfile_createServerFn_handler",
		importer: () => import("./auth.functions-4bbTCUen.js")
	},
	"e30b47418872d7ca1fb2d3af3e86d8b52c3f8a1c070269d6763789d0886ee8f4": {
		functionName: "updateMediaServer_createServerFn_handler",
		importer: () => import("./media.functions-DyuXdkBt.js")
	},
	"e3e3d3d1e25a2df540963a5960e082801c0920dfc74b6fb332b8a471307562ab": {
		functionName: "changeMyPassword_createServerFn_handler",
		importer: () => import("./auth.functions-4bbTCUen.js")
	},
	"e4f613da354b95ded8ce2081279082f37e586523eb22e7ba9403d1ead85e95f2": {
		functionName: "listAdminUsers_createServerFn_handler",
		importer: () => import("./admin-users.functions-BS1WhxRV.js")
	},
	"e5bfa53b8bb05306086be3399e030e1e91d57b9aade854e12065b2e1beea5725": {
		functionName: "bulkDeleteAdminUsers_createServerFn_handler",
		importer: () => import("./admin-users.functions-BS1WhxRV.js")
	},
	"e64b37bc9940d0ba56463e85ceb4d39ddccd5b5b564bb2e6480503d612b429d3": {
		functionName: "getAllAdminArticles_createServerFn_handler",
		importer: () => import("./articles.functions-BR0s-JF3.js")
	},
	"e7422c1d0dee309e19778cc925e6c65b59c486bec05682f414fd48988f9b3f48": {
		functionName: "deleteAdminArticlesBulk_createServerFn_handler",
		importer: () => import("./articles.functions-BR0s-JF3.js")
	},
	"ea95d7a78753f255e229f0ab8bcfcbe50478660db4ce742569cf640edc33c4d2": {
		functionName: "lookupArticleByUrlOrSlugFn_createServerFn_handler",
		importer: () => import("./comments.functions-CfzX1ASd.js")
	},
	"f2b55fcbc61de640bdc246a756afade094af300f815b713c633816f7f0b40536": {
		functionName: "importCategories_createServerFn_handler",
		importer: () => import("./taxonomy.functions-BAzvOQF8.js")
	},
	"f8f7c94053b6df65dd311c004de419a04972d1da2641bd4652225fe862ccc09f": {
		functionName: "signOutServer_createServerFn_handler",
		importer: () => import("./auth.functions-4bbTCUen.js")
	},
	"fc9dae9aa403f9bc644d51588c7c5f5b486d759eecd1cfd041e553d794565167": {
		functionName: "incrementRedirectHitServer_createServerFn_handler",
		importer: () => import("./redirect-rules-CdqlcePF.js")
	}
};
async function getServerFnById(id, access) {
	const serverFnInfo = manifest[id];
	if (!serverFnInfo) throw new Error("Server function info not found for " + id);
	const fnModule = serverFnInfo.module ?? await serverFnInfo.importer();
	if (!fnModule) throw new Error("Server function module not resolved for " + id);
	const action = fnModule[serverFnInfo.functionName];
	if (!action) throw new Error("Server function module export not resolved for serverFn ID: " + id);
	return action;
}
//#endregion
export { getServerFnById as t };
