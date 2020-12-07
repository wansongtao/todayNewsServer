/*
Navicat MySQL Data Transfer

Source Server         : mysql
Source Server Version : 80022
Source Host           : localhost:3306
Source Database       : todaynews

Target Server Type    : MYSQL
Target Server Version : 80022
File Encoding         : 65001

Date: 2020-12-07 17:51:03
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `category`
-- ----------------------------
DROP TABLE IF EXISTS `category`;
CREATE TABLE `category` (
  `categoryId` smallint NOT NULL AUTO_INCREMENT COMMENT '栏目id，自增',
  `categoryName` varchar(4) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '栏目名称，唯一性',
  `categoryHot` tinyint DEFAULT '0' COMMENT '栏目热度',
  PRIMARY KEY (`categoryId`),
  UNIQUE KEY `categoryName` (`categoryName`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of category
-- ----------------------------
INSERT INTO `category` VALUES ('11', '头条', '10');
INSERT INTO `category` VALUES ('12', '热点', '9');
INSERT INTO `category` VALUES ('13', '娱乐', '5');
INSERT INTO `category` VALUES ('14', '体育', '0');
INSERT INTO `category` VALUES ('15', '游戏', '5');
INSERT INTO `category` VALUES ('16', '财经', '5');
INSERT INTO `category` VALUES ('17', '军事', '0');
INSERT INTO `category` VALUES ('18', '历史', '0');
INSERT INTO `category` VALUES ('19', '社会', '0');
INSERT INTO `category` VALUES ('20', '政治', '0');

-- ----------------------------
-- Table structure for `commentdetails`
-- ----------------------------
DROP TABLE IF EXISTS `commentdetails`;
CREATE TABLE `commentdetails` (
  `commentId` int NOT NULL AUTO_INCREMENT COMMENT '评论id',
  `commentContent` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '评论内容',
  `commentDate` datetime NOT NULL COMMENT '评论时间',
  PRIMARY KEY (`commentId`)
) ENGINE=InnoDB AUTO_INCREMENT=1025 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of commentdetails
-- ----------------------------
INSERT INTO `commentdetails` VALUES ('999', '不过是大梦一场空', '2020-12-01 12:12:12');
INSERT INTO `commentdetails` VALUES ('1000', '不过是孤影照惊鸿', '2020-11-16 11:47:56');
INSERT INTO `commentdetails` VALUES ('1001', '不过是白驹之过一场梦', '2020-11-16 12:50:06');
INSERT INTO `commentdetails` VALUES ('1002', '失败并不可怕，害怕失败才真正可怕', '2020-11-17 15:00:34');
INSERT INTO `commentdetails` VALUES ('1003', '有道是万物皆虚空', '2020-11-17 15:01:30');
INSERT INTO `commentdetails` VALUES ('1004', '有道是苦海最无穷', '2020-11-17 15:01:49');
INSERT INTO `commentdetails` VALUES ('1005', '写的太好了吧', '2020-11-16 15:08:58');
INSERT INTO `commentdetails` VALUES ('1006', '妙啊', '2020-11-16 15:09:12');
INSERT INTO `commentdetails` VALUES ('1007', '厉害了', '2020-11-16 15:09:29');
INSERT INTO `commentdetails` VALUES ('1008', '哈哈哈哈', '2020-11-17 16:29:06');
INSERT INTO `commentdetails` VALUES ('1009', '不过是大梦一场空，不过是孤影照惊鸿，不过是白驹之过一场梦。', '2020-12-01 10:10:20');
INSERT INTO `commentdetails` VALUES ('1010', '在某个安静的夜晚清点过往，承认往事只能回味，更加珍惜身边人、身前事。', '2020-12-01 10:11:07');
INSERT INTO `commentdetails` VALUES ('1011', '有的错过源于缺乏勇气，有的错过则是命运弄人。', '2020-12-01 10:11:28');
INSERT INTO `commentdetails` VALUES ('1012', '人生不能太过圆满，求而不得未必是遗憾。', '2020-12-01 10:12:01');
INSERT INTO `commentdetails` VALUES ('1013', '人亦如此，既非圣贤，孰能无过。', '2020-12-01 10:12:28');
INSERT INTO `commentdetails` VALUES ('1014', '成年时的一场远行，目的地定在海边，海水没过脚面的那个瞬间，内心深处的叫喊声，是朝向童年的。', '2020-12-01 11:54:25');
INSERT INTO `commentdetails` VALUES ('1015', '写的太好了吧', '2020-12-01 16:59:08');
INSERT INTO `commentdetails` VALUES ('1016', '我没胆量犯错，才把一切错过。', '2020-12-06 06:29:06');
INSERT INTO `commentdetails` VALUES ('1017', '优秀', '2020-12-06 06:31:05');
INSERT INTO `commentdetails` VALUES ('1018', 'nice', '2020-12-06 06:45:47');
INSERT INTO `commentdetails` VALUES ('1019', '加油', '2020-12-06 06:50:13');
INSERT INTO `commentdetails` VALUES ('1020', '太厉害了吧', '2020-12-06 06:51:30');
INSERT INTO `commentdetails` VALUES ('1021', '秀儿是你吗', '2020-12-06 06:52:13');
INSERT INTO `commentdetails` VALUES ('1022', '行到水穷处，坐看云起时。', '2020-12-07 00:44:16');
INSERT INTO `commentdetails` VALUES ('1023', '千山鸟飞绝，万径人踪灭。', '2020-12-07 00:46:25');
INSERT INTO `commentdetails` VALUES ('1024', '爱而不得是常态，习惯就好了', '2020-12-07 03:20:22');

-- ----------------------------
-- Table structure for `newsdetail`
-- ----------------------------
DROP TABLE IF EXISTS `newsdetail`;
CREATE TABLE `newsdetail` (
  `newsId` int NOT NULL AUTO_INCREMENT COMMENT '新闻id，自增',
  `newsTitle` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '新闻标题',
  `newsContent` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '新闻内容',
  `newsCover` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '新闻封面路径',
  `newsType` enum('0','1') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT '1' COMMENT '新闻类别，1文章，0视频',
  `newsHot` int DEFAULT '0' COMMENT '新闻点赞数',
  `newsDate` date DEFAULT NULL COMMENT '发布日期',
  PRIMARY KEY (`newsId`)
) ENGINE=InnoDB AUTO_INCREMENT=10023 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of newsdetail
-- ----------------------------
INSERT INTO `newsdetail` VALUES ('10001', '我没胆量犯错，才把一切错过', '<div id=\"articleContent\"><p>生命的很多事，你错过一小时，很可能就错过一生了。    ——林清玄</p><p>人们常执著于求不得和爱别离：昨日的疏忽、骄傲、懒惰、惧怕都是遗憾的种子。那些揪心的自责和懊悔，常常不可与人言说。</p><p>没能抓住的机会、没能制止的错误、没能珍惜的情感，遗憾使人惘然，也令人着迷。我们常常想着，“如果当时……就好了”，在脑海倒流时光，修正过错，成全所有美丽的可能性。</p><p>计算机科学中经常提到“容错”，系统发生故障时，能自行采取补救措施，不会影响整个系统正常工作。人亦如此，既非圣贤，孰能无过。适度的懊悔能帮助我们成为更好的人。除非它们走得太远，成为了内疚和自怨自艾。</p><p>德文的“流逝”和“犯罪”是同一个词，用来描述失去的时间和道德。错过随着时间流逝，变得面目温和：在某个安静的夜晚清点过往，承认往事只能回味，更加珍惜身边人、身前事。</p><h6>诗意生活态度</h6><p>王安忆在《长恨歌》中写了一位“爱错人”的女子蒋丽莉，“她不是看不见，而是不愿看程先生的憔悴是为什么，她只想：程先生就算是一块坚冰，她用满肚肠的热，也能融化它。蒋丽莉读过的小说这会儿都来帮她的忙，教她温柔有情，教她言语生风，还教她分析形势，只可惜她扮错了角色，起首一句错了，全篇都错。信心是错，希望也是错的。”有的错过源于缺乏勇气，有的错过则是命运弄人。人生不能太过圆满，求而不得未必是遗憾。</p><span>——摘自《为你读诗》</span></div>', '/upload/img/hy10.jpg', '1', '102', '2020-11-12');
INSERT INTO `newsdetail` VALUES ('10002', '一声海潮一声秋，几许深情几许愁', '<div id=\"articleContent\"><p>哗啦哗啦的冰的碎块 乘着波浪作响，我在海岸的月夜里往还。  ——石川啄木【日】</p><p>“以后，我要去海边生活。”年幼的时候，这样想过。</p><p>久居内陆的人，似乎比生长在海边的人更加爱海。这是一种与故土毫不相干的情感，或许一切始于那枚海螺壳，母亲说把它扣在耳朵上，可以听到海浪声。</p><p>作家林海音的《城南旧事》里，幼年林英子常常背诵“我们看海去/我们看海去/蓝色的大海上/扬着白色的帆”。她一遍一遍地念着，就好像一个日后必要履行的约定。成年时的一场远行，目的地定在海边，海水没过脚面的那个瞬间，内心深处的叫喊声，是朝向童年的。</p><p>之后的几年，在一个半岛城市短暂生活。季夏夜晚或秋日黄昏，去海边走走，“海暗了，鸥鸟的叫声，微白”（松尾芭蕉），这些场景成为生活里习以为常的一部分，海浪、潮声和咸湿气味，都深深烙入记忆。</p><p>童年的想望流入现实，是海达成了这份圆满。</p><p>纵使成年后的自己，对那片深蓝的海域不再有热烈幻想，伫立海岸时，想到被海水吞噬的雪莱，内心也会猛然颤栗：“海是会吃人的。”但诗人的碑文却又把路人心中的战栗驱散——</p><p>他的一切并没有消逝，只是经历海的变异已变得丰富而神奇。雪莱墓上的三行诗引自莎士比亚的《暴风雨》</p><p>或许海自有一种魔力，变成很多人心口的一颗朱砂痣，牢固而稳定。纵然“你不是海里的鱼”，面对海的宽广拥抱，所有微不足道的哀愁，都会被洗刷干净。</p><p>秋意渐浓时，记得去海边走走。</p><p></p><p></p><span>——摘自《为你读诗》</span></div>', '/upload/img/hy1.jpg', '1', '22', '2020-11-13');
INSERT INTO `newsdetail` VALUES ('10003', '有些话没有说，我知道你会懂', '<div id=\"articleContent\"><p>秋日的光景一天深似一天，尤其傍晚时，夕阳悄悄滑落，目之所及皆罩上一层薄薄的云霭似的，异样的温柔之境，使人心思沉谧。</p><p>伫立窗前，看那肥腴的圆状物在城市的缝隙间游移，“用猫的软蹄临近身边”，没有听得声响却隐隐感到一些温暖，内心的寂寥顷刻间散去。</p><p>蒲桃色的长椅上面，睡着的猫白糊糊的，秋天的黄昏。</p><p>你走到窗口靠近我，静默无言。“爱是非言辞的”，眼神交汇时互放的光亮，是人与人之间难得的默契。有时，话说得多了反而显得浅薄，没有诚意。</p><p>一如夕阳的探望向来无言，猫也不会过分的表达爱，但它睡着时紧紧抱住你的手臂，黄昏时卧在你脚边，即便独处也不觉孤身一人，依赖亦是陪伴。</p><p>不知道什么地方，有烧着桔子皮似的气味，天色已近黄昏了。</p><p>“有阴影从大地升上来”，火焰色的云层如浪卷起，一涨一退间，夜幕乘虚而入。童年的脚步声传来，母亲握着我的手，一起往家中走去。</p><p>周围寂静无声，我的手汗涔涔的，母亲哼起小调，那黄昏时暖人的光似乎又浮在眼前，之后的路轻松多了，爱悄无声息地遮蔽了黑暗。</p><p>在雪上流动的淡红色的落日的影子，照在旷野的火车的窗上。</p><p>列车在暮色中启动，五岁的孩童已是二十五岁的成年人，光影落在故乡的站台上，父亲和母亲的脸泛着金黄的光，皱纹清晰可见。</p><p>旷野之中，并飞的鹭鸶“在八月的凉风中逍遥”，夕阳的余温留在车窗上，父亲的烟味留在我的手掌中，母亲拥抱我时留下她身上独有的香气。</p><p>爱的形态，若非言辞，便是这些了：无言的默契，悄声的陪伴，从前的记忆，还有永远不会消散的熟悉味道……</p><p></p><p></p><span>——摘自《为你读诗》</span></div>', '/upload/img/hy0.jpg', '1', '33', '2020-11-10');
INSERT INTO `newsdetail` VALUES ('10004', '木叶纷纷落，满身都是秋', '<div id=\"articleContent\"><p>北方的秋，总是来得静，来得轻。</p><p>扑面而来的风，不知什么时候，开始有了凉意。倘使你放慢脚步，便会看到，早晨的旭日和黄昏的落日，已与夏天时大不相同。就连路边的杨树叶子，也变得比夏天更深邃，更苍凉了。</p><p>南方不一样，“南方的秋天只能在日历的节气里想象。”（舒丹丹《南方的秋天，或者错觉》）立秋、秋分、寒霜，眼看都快霜降了，还不见它的踪影。</p><p>满街的香樟绿得让人生气。待你这厢等得不胜其烦时，秋天却突然闯了进来。一场大雨过后，一夜之间，就将夏天击得落荒而逃，留下满地堆积的落叶和骤然下降的气温，直让人目瞪口呆，措手不及。</p><p>但即使是这样任性的秋天，也是可爱的：暑气初消，月满花香，一望无垠的金黄稻束如波浪般随风起伏。就连雨水，也被那零星飘落的红叶染得可爱了。</p><p>古人知秋意，从云天、木叶、风声里感知：“袅袅兮秋风，洞庭波兮木叶下”“云天收夏色，木叶动秋声”，多么诗意闲适。</p><p>郁达夫写《故都的秋》，清晨起来，“泡一碗浓茶，向院子一坐。”看一看澄净似海的天空，听一听白鸽的飞声，就不算辜负了这秋意。</p><p>城市里也不是没有秋天。就像林清玄先生说的，若“能与落叶飞花同呼吸，能保有在自然中谦卑的心情，就是住在最热闹的城市，秋天也不会远去；如果眼里只有手表、金钱、工作，即使在路上被落叶击中，也见不到秋天的美。”</p><p>秋天，无论在什么地方，都是好的。你不如放慢脚步，随便走走，和初秋来一场邂逅。</p><p></p><p></p><span>——摘自《为你读诗》</span></div>', '/upload/img/hy2.jpg', '1', '63', '2020-11-04');
INSERT INTO `newsdetail` VALUES ('10005', '转身离开，在一切还来得及前', '<div id=\"articleContent\"><p>“一些相对而言的歧途，是他们理解的归宿。”    ——韩东《多么冷静》</p><p>处暑已过，但夏的尾巴仍在不甘心地鞭笞着空气，方凉快几天，热气又反噬回来，想在入秋前吓退万物；但秋也不示弱，迎着热浪，刮起大风，誓要带我们挺进肃秋。夏秋之交就如同一列行驶在无灯隧道里的火车，需凭直觉和勇气来面对即将到来的转角，而转角后面是否是一片好风景，我们是无法预知的。</p><p>但“转角”是必要的。</p><p>大部分时候，我们的生活也像行驶在规定轨道上的火车，有时候感觉外在的秩序已经像铁丝一样嵌入自己内心，于是内外都长出围墙。我们试图擦亮车窗，从数年如一日的“风景”中辨认出不一样的细节；试图在生活这个透明皮球上扎几个小孔，换一点气，但却发现，只是“刹车”，可能还是解决不了问题。</p><p>于是，你想要的冲击一下这个惯性，比如结束一段感情，离开一座城市，试着去理解不同的观点……但却发现要跳出“陈旧的风景”并不容易，且越往后走，越不敢舍弃。</p><p>在这个过程中更为困难的是，命运总是比你狡猾，不会以“十字路口”的形式直接提示你“是时候选择是否刹车了”，这种“转角”有时会暗藏在平坦大道上，你浑然不觉，直到“酝酿不出任何新的东西，甚至也不能点燃自己。”</p><p>而“人生岂能几易其稿”，当你惊醒，想要转弯的时候，却发现刹车已经失灵。你拼命按喇叭，却只有自己能听见。</p><p>诗人马骅“选择离开当代诗坛去雪山，这里有一个决断的意思，到了雪山之后他的写作马上成熟了。”</p><p>幻想中的生活日渐稀薄，淡得没味 把过浓的胆汁冲淡为清水 少年仍用力奔跑在月光里追着多余的自己远去——马骅《在变老之前远去》</p><p>这种转身离开，不只是地理意义上的离开，还包括内在的更新，自己对自己的在定义，而不是耽溺于自洽的逻辑，陷于窠臼。</p><p>其实转身离开之后的道路会否明亮不能保证，但重要的是不能丧失去“刹车”的自省力，这个动作本身的意义更为重大。在皮球无法再往下压的时候，一定要及时转身离开。</p><p>希望不论途径多少地方，经历多少人事，我们都要在被消耗殆尽之前，有勇气选择转身离开，重新开始。敢于失去和承担代价。</p><p></p><p></p><span>——摘自《为你读诗》</span></div>', '/upload/img/hy3.jpg', '1', '98', '2020-11-18');
INSERT INTO `newsdetail` VALUES ('10006', '每个人的生命里都隐藏着无数场等待', '<div id=\"articleContent\"><p>每个人的生命里都隐藏着无数场等待。</p><p>一场“告别失眠”的好梦，一盒“期待已久”的快递，一份“填补花呗”的工资，一次“华丽蜕变”的考试，一段“重归于好”的爱情......</p><p>“要知道，许多在眼前看来天大的事，都不是人生一战，而只是人生一站。”（七堇年语）</p><p>有太多消耗耐心的等待，可期待永远在持续。人生漫漫还有更多未知的站台，需要“悬停”时精准地“对焦”，让个体在闪光灯下成为更好的自我。</p><p>年轻和幼稚都会造成同样的弱点：缺乏耐性。无论做什么事，都想马上看到结果。人生就是一连串的等待，这样的教训往往得活到中年才能体会。</p><p>时间总能给出答案，年幼想不通的问题，到中年会恍然顿悟。今夜无法搁置的心事，刚进入睡眠，又被生物钟唤醒；等山上在落几场雪，寂寥的冬日转眼也会结束。</p><p>等你苏醒时，才发现这一年竟都要过完了。</p><p>年复一年，生命里有太多隐藏的“金币”（机遇）等候着我们，甚至还有让人瞬间成长的“蘑菇”（经验）。一路打怪的日子，看似乏善可陈，但他日终将“开花结果”。</p><p>等待全都是遥不可及的“苦”吗？在坚韧者的心房里，始终持有一份胜券在握的“甜”。就像英国诗人勃朗宁所言：“你总有一天将爱我，我能等。”</p><p>多想拥有这样的“自信”啊，将所有的平淡调剂成微甜。连约会前的等待，都是甜蜜的序曲。</p><p>想起狐狸对小王子的期待，“比如说你在下午四点来，从三点钟开始，我就会刚到快乐，时间越临近，我就越来越感到快乐。到了四点钟的时候，我就坐立不安，我发现了幸福的价值。”</p><p>所期待的事，“战线”拉得越久，大脑便会分泌出越多的多巴胺，让人更觉得值得。在漫长而微苦的岁月里，你等的那个人，说不定也在偷偷想你。</p><p></p><p></p><span>——摘自《为你读诗》</span></div>', '/upload/img/hy4.jpg', '1', '18', '2020-11-15');
INSERT INTO `newsdetail` VALUES ('10007', '爱情不过是一种疯', '<div id=\"articleContent\"><p>爱不表现则不存在。  ——莎士比亚</p><p>德籍法国作曲家奥芬巴赫写了一辈子的轻歌剧，是法国轻歌剧的奠基人。但在人生的最后时刻，他用尽毕生心血写下了自己唯一一部正歌剧作品《霍夫曼的故事》。今夜这首《船歌》便收录其中。</p><p>故事的主角E.T.A霍夫曼，是德国浪漫主义诗人、小说家。因为特立独行的做派，经常描写“神叨叨”的故事，遭到了主流社会的排挤。</p><p>《霍夫曼的故事》融合了霍夫曼的小说内容，编写了霍夫曼的三段恋情：他去追逐美丽的少女，结果发现对方是只会歌唱的上了发条的木偶；他遇到了爱唱的少女，两情相悦满心欢喜，不幸姑娘身患重症，在魔鬼的诱惑下啼血绝唱而亡；他邂逅了魅惑的交际花，掏心掏肺地将灵魂献上，可惜21克的东西终究比不上21克拉的东西……全情投入，皆以悲剧收场。</p><p>就像《船歌》里唱的：“温柔浪漫的爱情真是荒谬！”</p><p> 一次又一次失败，也无法阻挡霍夫曼拼尽全力去爱的热情，即使献上自己最珍贵的东西也在所不惜。即使挨了刀子流了血，也要唱出歌来。</p><p>毕竟莎士比亚早就有过预言：“爱情不过是一种疯。”</p><p>现实里的霍夫曼也是一样“没在怕的”。</p><p>霍夫曼学生时代攻读法律，毕业后在柏林当法官。但“人生赢家”配置并不是他的追求，他写作，绘画，作曲，笔下被魔鬼支配的故事成了许多人的噩梦。人们称他为“魔鬼霍夫曼”。大文豪歌德公开表示对他的不欣赏。</p><p>但这一切并不影响爱他的人对他的喜爱：包括大仲马、巴尔扎克、陀思妥耶夫斯基在内的后世文豪都曾向他致敬。他的一部长篇叙事诗被柴可夫斯基改编成芭蕾舞剧《胡桃夹子》，举世闻名；而奥芬巴赫呕心沥血将他的人生经历和文学作品相融合，写就了法国歌剧的一座高峰。</p><p>对未知怀有恐惧在正常不过，不被理解，不被接纳，不被爱，都会让人害怕。但包括爱情在内，很多事不是怕了就不会来，面对恐惧迎头痛击，即使伤个彻底也算是种本事。</p><p>永远温吞地固守着自以为是的安全，大概就是世界上最无聊的事了吧。</p><h6>诗意生活态度</h6><p>永远停在原地等待被爱，就像守株待兔，是很难有结果的。如英国哲学家伯特兰·罗素所言：“害怕爱情就是害怕生活，而害怕生活的人已经被黄土埋了半截了。”或许你听说过《冰与火之歌》中那句经典的话：“一个人如果害怕，还能勇敢么？”“人只有在害怕的时候才会变勇敢。”</p><span>——摘自《为你读诗》</span></div>', '/upload/img/hy5.jpg', '1', '15', '2020-11-20');
INSERT INTO `newsdetail` VALUES ('10008', '渺小的存在，胜过傲慢的虚空', '<div id=\"articleContent\"><p>人只有经历自己的渺小，才能到达高尚。    ——卡夫卡</p><p>遥想浩瀚无垠的宇宙，回首世世代代的先祖，我们的生命仿佛显得渺小而偶然。</p><p>在这广袤的星球上，曾有1080亿人静静地活过，又安详地消失。而今，我们活跃在拥有70亿人的星球里，成为了大千世界里的一员。</p><p>时光驯服着一切，世间风物的存在与变迁，人类精神的迷惘与觉醒。在反观自我，人之为人的孤独、脆弱、焦虑也无可规避……</p><p>换个角度来说，我们又是某种意义上的边缘人与渺小者，如一只负重前行的蜗牛，背着“无远弗届”的内核，在各自的陡坡上奋斗攀爬。可现实往往是攀爬的速度比不上父母老去的速度。随着年岁的增长，自己所背负“壳”也愈加沉重……</p><p>大千世界，每天都上演这感情“渺小”的时刻：投简历的那一刻，好像往大海里投了一粒沙行走在陌生的城市，人来人往，举目无亲面对已成定局的事，命运让你无力回天。</p><p>这些酸楚的往事，最终释放出一种意义，使人逐渐变得谦卑；那些小我所经历的悲苦，多年后再次复燃忆起，它们早已熔为身体上一块印记，成为记忆缝合点里一个不可追溯的刺点。</p><p>有时，渺小的存在，胜过了傲慢的虚空。</p><p>不如，“从今天开始，重新做自己的蜗牛。”持守这一方不被惊扰的“小千世界”。风雨如晦时，能神游安宁；人云亦云时，能超然自省；孤独委屈时，可酩酊大醉。</p><p>多想拥有这样的“自信”啊，将所有的平淡调剂成微甜。连约会前的等待，都是甜蜜的序曲。</p><p>其实，让人摆脱孤独的从来都不是喧嚣，战胜渺小的从来都不是自大。</p><p>正因我们的渺小，现实存在的悲喜、爱恨、痛痒才值得回味，才会有形形色色的人生足以分享，得以借鉴—原来，人就是这样地活着。我们生而渺小，却并非无足轻重。</p><p></p><p></p><span>——摘自《为你读诗》</span></div>', '/upload/img/hy6.jpg', '1', '9', '2020-11-21');
INSERT INTO `newsdetail` VALUES ('10009', '要知道，许多在眼前看来天大的事，都不是人生一战，而只是人生一站。', '<div id=\"articleContent\"><p>人只有经历自己的渺小，才能到达高尚。    ——卡夫卡</p><p>遥想浩瀚无垠的宇宙，回首世世代代的先祖，我们的生命仿佛显得渺小而偶然。</p><p>在这广袤的星球上，曾有1080亿人静静地活过，又安详地消失。而今，我们活跃在拥有70亿人的星球里，成为了大千世界里的一员。</p><p>时光驯服着一切，世间风物的存在与变迁，人类精神的迷惘与觉醒。在反观自我，人之为人的孤独、脆弱、焦虑也无可规避……</p><p>换个角度来说，我们又是某种意义上的边缘人与渺小者，如一只负重前行的蜗牛，背着“无远弗届”的内核，在各自的陡坡上奋斗攀爬。可现实往往是攀爬的速度比不上父母老去的速度。随着年岁的增长，自己所背负“壳”也愈加沉重……</p><p>大千世界，每天都上演这感情“渺小”的时刻：投简历的那一刻，好像往大海里投了一粒沙行走在陌生的城市，人来人往，举目无亲面对已成定局的事，命运让你无力回天。</p><p>这些酸楚的往事，最终释放出一种意义，使人逐渐变得谦卑；那些小我所经历的悲苦，多年后再次复燃忆起，它们早已熔为身体上一块印记，成为记忆缝合点里一个不可追溯的刺点。</p><p>有时，渺小的存在，胜过了傲慢的虚空。</p><p>不如，“从今天开始，重新做自己的蜗牛。”持守这一方不被惊扰的“小千世界”。风雨如晦时，能神游安宁；人云亦云时，能超然自省；孤独委屈时，可酩酊大醉。</p><p>多想拥有这样的“自信”啊，将所有的平淡调剂成微甜。连约会前的等待，都是甜蜜的序曲。</p><p>其实，让人摆脱孤独的从来都不是喧嚣，战胜渺小的从来都不是自大。</p><p>正因我们的渺小，现实存在的悲喜、爱恨、痛痒才值得回味，才会有形形色色的人生足以分享，得以借鉴—原来，人就是这样地活着。我们生而渺小，却并非无足轻重。</p><p></p><p></p><span>——摘自《为你读诗》</span></div>', '/upload/img/hy10.jpg', '1', '0', '2020-11-16');
INSERT INTO `newsdetail` VALUES ('10010', '爱不表现则不存在。 ——莎士比亚', '<div id=\"articleContent\"><p>人只有经历自己的渺小，才能到达高尚。    ——卡夫卡</p><p>遥想浩瀚无垠的宇宙，回首世世代代的先祖，我们的生命仿佛显得渺小而偶然。</p><p>在这广袤的星球上，曾有1080亿人静静地活过，又安详地消失。而今，我们活跃在拥有70亿人的星球里，成为了大千世界里的一员。</p><p>时光驯服着一切，世间风物的存在与变迁，人类精神的迷惘与觉醒。在反观自我，人之为人的孤独、脆弱、焦虑也无可规避……</p><p>换个角度来说，我们又是某种意义上的边缘人与渺小者，如一只负重前行的蜗牛，背着“无远弗届”的内核，在各自的陡坡上奋斗攀爬。可现实往往是攀爬的速度比不上父母老去的速度。随着年岁的增长，自己所背负“壳”也愈加沉重……</p><p>大千世界，每天都上演这感情“渺小”的时刻：投简历的那一刻，好像往大海里投了一粒沙行走在陌生的城市，人来人往，举目无亲面对已成定局的事，命运让你无力回天。</p><p>这些酸楚的往事，最终释放出一种意义，使人逐渐变得谦卑；那些小我所经历的悲苦，多年后再次复燃忆起，它们早已熔为身体上一块印记，成为记忆缝合点里一个不可追溯的刺点。</p><p>有时，渺小的存在，胜过了傲慢的虚空。</p><p>不如，“从今天开始，重新做自己的蜗牛。”持守这一方不被惊扰的“小千世界”。风雨如晦时，能神游安宁；人云亦云时，能超然自省；孤独委屈时，可酩酊大醉。</p><p>多想拥有这样的“自信”啊，将所有的平淡调剂成微甜。连约会前的等待，都是甜蜜的序曲。</p><p>其实，让人摆脱孤独的从来都不是喧嚣，战胜渺小的从来都不是自大。</p><p>正因我们的渺小，现实存在的悲喜、爱恨、痛痒才值得回味，才会有形形色色的人生足以分享，得以借鉴—原来，人就是这样地活着。我们生而渺小，却并非无足轻重。</p><p></p><p></p><span>——摘自《为你读诗》</span></div>', '/upload/img/hy10.jpg', '1', '1', '2020-11-17');
INSERT INTO `newsdetail` VALUES ('10011', '人只有经历自己的渺小，才能到达高尚。 ——卡夫卡', '<div id=\"articleContent\"><p>人只有经历自己的渺小，才能到达高尚。    ——卡夫卡</p><p>遥想浩瀚无垠的宇宙，回首世世代代的先祖，我们的生命仿佛显得渺小而偶然。</p><p>在这广袤的星球上，曾有1080亿人静静地活过，又安详地消失。而今，我们活跃在拥有70亿人的星球里，成为了大千世界里的一员。</p><p>时光驯服着一切，世间风物的存在与变迁，人类精神的迷惘与觉醒。在反观自我，人之为人的孤独、脆弱、焦虑也无可规避……</p><p>换个角度来说，我们又是某种意义上的边缘人与渺小者，如一只负重前行的蜗牛，背着“无远弗届”的内核，在各自的陡坡上奋斗攀爬。可现实往往是攀爬的速度比不上父母老去的速度。随着年岁的增长，自己所背负“壳”也愈加沉重……</p><p>大千世界，每天都上演这感情“渺小”的时刻：投简历的那一刻，好像往大海里投了一粒沙行走在陌生的城市，人来人往，举目无亲面对已成定局的事，命运让你无力回天。</p><p>这些酸楚的往事，最终释放出一种意义，使人逐渐变得谦卑；那些小我所经历的悲苦，多年后再次复燃忆起，它们早已熔为身体上一块印记，成为记忆缝合点里一个不可追溯的刺点。</p><p>有时，渺小的存在，胜过了傲慢的虚空。</p><p>不如，“从今天开始，重新做自己的蜗牛。”持守这一方不被惊扰的“小千世界”。风雨如晦时，能神游安宁；人云亦云时，能超然自省；孤独委屈时，可酩酊大醉。</p><p>多想拥有这样的“自信”啊，将所有的平淡调剂成微甜。连约会前的等待，都是甜蜜的序曲。</p><p>其实，让人摆脱孤独的从来都不是喧嚣，战胜渺小的从来都不是自大。</p><p>正因我们的渺小，现实存在的悲喜、爱恨、痛痒才值得回味，才会有形形色色的人生足以分享，得以借鉴—原来，人就是这样地活着。我们生而渺小，却并非无足轻重。</p><p></p><p></p><span>——摘自《为你读诗》</span></div>', '/upload/img/hy10.jpg', '1', '0', '2020-11-18');
INSERT INTO `newsdetail` VALUES ('10012', '“一些相对而言的歧途，是他们理解的归宿。” ——韩东《多么冷静》', '<div id=\"articleContent\"><p>人只有经历自己的渺小，才能到达高尚。    ——卡夫卡</p><p>遥想浩瀚无垠的宇宙，回首世世代代的先祖，我们的生命仿佛显得渺小而偶然。</p><p>在这广袤的星球上，曾有1080亿人静静地活过，又安详地消失。而今，我们活跃在拥有70亿人的星球里，成为了大千世界里的一员。</p><p>时光驯服着一切，世间风物的存在与变迁，人类精神的迷惘与觉醒。在反观自我，人之为人的孤独、脆弱、焦虑也无可规避……</p><p>换个角度来说，我们又是某种意义上的边缘人与渺小者，如一只负重前行的蜗牛，背着“无远弗届”的内核，在各自的陡坡上奋斗攀爬。可现实往往是攀爬的速度比不上父母老去的速度。随着年岁的增长，自己所背负“壳”也愈加沉重……</p><p>大千世界，每天都上演这感情“渺小”的时刻：投简历的那一刻，好像往大海里投了一粒沙行走在陌生的城市，人来人往，举目无亲面对已成定局的事，命运让你无力回天。</p><p>这些酸楚的往事，最终释放出一种意义，使人逐渐变得谦卑；那些小我所经历的悲苦，多年后再次复燃忆起，它们早已熔为身体上一块印记，成为记忆缝合点里一个不可追溯的刺点。</p><p>有时，渺小的存在，胜过了傲慢的虚空。</p><p>不如，“从今天开始，重新做自己的蜗牛。”持守这一方不被惊扰的“小千世界”。风雨如晦时，能神游安宁；人云亦云时，能超然自省；孤独委屈时，可酩酊大醉。</p><p>多想拥有这样的“自信”啊，将所有的平淡调剂成微甜。连约会前的等待，都是甜蜜的序曲。</p><p>其实，让人摆脱孤独的从来都不是喧嚣，战胜渺小的从来都不是自大。</p><p>正因我们的渺小，现实存在的悲喜、爱恨、痛痒才值得回味，才会有形形色色的人生足以分享，得以借鉴—原来，人就是这样地活着。我们生而渺小，却并非无足轻重。</p><p></p><p></p><span>——摘自《为你读诗》</span></div>', '/upload/img/hy10.jpg', '1', '0', '2020-11-19');
INSERT INTO `newsdetail` VALUES ('10013', '秋天，无论在什么地方，都是好的。你不如放慢脚步，随便走走，和初秋来一场邂逅。', '<div id=\"articleContent\"><p>人只有经历自己的渺小，才能到达高尚。    ——卡夫卡</p><p>遥想浩瀚无垠的宇宙，回首世世代代的先祖，我们的生命仿佛显得渺小而偶然。</p><p>在这广袤的星球上，曾有1080亿人静静地活过，又安详地消失。而今，我们活跃在拥有70亿人的星球里，成为了大千世界里的一员。</p><p>时光驯服着一切，世间风物的存在与变迁，人类精神的迷惘与觉醒。在反观自我，人之为人的孤独、脆弱、焦虑也无可规避……</p><p>换个角度来说，我们又是某种意义上的边缘人与渺小者，如一只负重前行的蜗牛，背着“无远弗届”的内核，在各自的陡坡上奋斗攀爬。可现实往往是攀爬的速度比不上父母老去的速度。随着年岁的增长，自己所背负“壳”也愈加沉重……</p><p>大千世界，每天都上演这感情“渺小”的时刻：投简历的那一刻，好像往大海里投了一粒沙行走在陌生的城市，人来人往，举目无亲面对已成定局的事，命运让你无力回天。</p><p>这些酸楚的往事，最终释放出一种意义，使人逐渐变得谦卑；那些小我所经历的悲苦，多年后再次复燃忆起，它们早已熔为身体上一块印记，成为记忆缝合点里一个不可追溯的刺点。</p><p>有时，渺小的存在，胜过了傲慢的虚空。</p><p>不如，“从今天开始，重新做自己的蜗牛。”持守这一方不被惊扰的“小千世界”。风雨如晦时，能神游安宁；人云亦云时，能超然自省；孤独委屈时，可酩酊大醉。</p><p>多想拥有这样的“自信”啊，将所有的平淡调剂成微甜。连约会前的等待，都是甜蜜的序曲。</p><p>其实，让人摆脱孤独的从来都不是喧嚣，战胜渺小的从来都不是自大。</p><p>正因我们的渺小，现实存在的悲喜、爱恨、痛痒才值得回味，才会有形形色色的人生足以分享，得以借鉴—原来，人就是这样地活着。我们生而渺小，却并非无足轻重。</p><p></p><p></p><span>——摘自《为你读诗》</span></div>', '/upload/img/hy10.jpg', '1', '0', '2020-11-22');
INSERT INTO `newsdetail` VALUES ('10014', '爱的形态，若非言辞，便是这些了：无言的默契，悄声的陪伴，从前的记忆，还有永远不会消散的熟悉味道……', '<div id=\"articleContent\"><p>人只有经历自己的渺小，才能到达高尚。    ——卡夫卡</p><p>遥想浩瀚无垠的宇宙，回首世世代代的先祖，我们的生命仿佛显得渺小而偶然。</p><p>在这广袤的星球上，曾有1080亿人静静地活过，又安详地消失。而今，我们活跃在拥有70亿人的星球里，成为了大千世界里的一员。</p><p>时光驯服着一切，世间风物的存在与变迁，人类精神的迷惘与觉醒。在反观自我，人之为人的孤独、脆弱、焦虑也无可规避……</p><p>换个角度来说，我们又是某种意义上的边缘人与渺小者，如一只负重前行的蜗牛，背着“无远弗届”的内核，在各自的陡坡上奋斗攀爬。可现实往往是攀爬的速度比不上父母老去的速度。随着年岁的增长，自己所背负“壳”也愈加沉重……</p><p>大千世界，每天都上演这感情“渺小”的时刻：投简历的那一刻，好像往大海里投了一粒沙行走在陌生的城市，人来人往，举目无亲面对已成定局的事，命运让你无力回天。</p><p>这些酸楚的往事，最终释放出一种意义，使人逐渐变得谦卑；那些小我所经历的悲苦，多年后再次复燃忆起，它们早已熔为身体上一块印记，成为记忆缝合点里一个不可追溯的刺点。</p><p>有时，渺小的存在，胜过了傲慢的虚空。</p><p>不如，“从今天开始，重新做自己的蜗牛。”持守这一方不被惊扰的“小千世界”。风雨如晦时，能神游安宁；人云亦云时，能超然自省；孤独委屈时，可酩酊大醉。</p><p>多想拥有这样的“自信”啊，将所有的平淡调剂成微甜。连约会前的等待，都是甜蜜的序曲。</p><p>其实，让人摆脱孤独的从来都不是喧嚣，战胜渺小的从来都不是自大。</p><p>正因我们的渺小，现实存在的悲喜、爱恨、痛痒才值得回味，才会有形形色色的人生足以分享，得以借鉴—原来，人就是这样地活着。我们生而渺小，却并非无足轻重。</p><p></p><p></p><span>——摘自《为你读诗》</span></div>', '/upload/img/hy10.jpg', '1', '0', '2020-11-06');
INSERT INTO `newsdetail` VALUES ('10015', '生命的很多事，你错过一小时，很可能就错过一生了。', '<div id=\"articleContent\"><p>人只有经历自己的渺小，才能到达高尚。    ——卡夫卡</p><p>遥想浩瀚无垠的宇宙，回首世世代代的先祖，我们的生命仿佛显得渺小而偶然。</p><p>在这广袤的星球上，曾有1080亿人静静地活过，又安详地消失。而今，我们活跃在拥有70亿人的星球里，成为了大千世界里的一员。</p><p>时光驯服着一切，世间风物的存在与变迁，人类精神的迷惘与觉醒。在反观自我，人之为人的孤独、脆弱、焦虑也无可规避……</p><p>换个角度来说，我们又是某种意义上的边缘人与渺小者，如一只负重前行的蜗牛，背着“无远弗届”的内核，在各自的陡坡上奋斗攀爬。可现实往往是攀爬的速度比不上父母老去的速度。随着年岁的增长，自己所背负“壳”也愈加沉重……</p><p>大千世界，每天都上演这感情“渺小”的时刻：投简历的那一刻，好像往大海里投了一粒沙行走在陌生的城市，人来人往，举目无亲面对已成定局的事，命运让你无力回天。</p><p>这些酸楚的往事，最终释放出一种意义，使人逐渐变得谦卑；那些小我所经历的悲苦，多年后再次复燃忆起，它们早已熔为身体上一块印记，成为记忆缝合点里一个不可追溯的刺点。</p><p>有时，渺小的存在，胜过了傲慢的虚空。</p><p>不如，“从今天开始，重新做自己的蜗牛。”持守这一方不被惊扰的“小千世界”。风雨如晦时，能神游安宁；人云亦云时，能超然自省；孤独委屈时，可酩酊大醉。</p><p>多想拥有这样的“自信”啊，将所有的平淡调剂成微甜。连约会前的等待，都是甜蜜的序曲。</p><p>其实，让人摆脱孤独的从来都不是喧嚣，战胜渺小的从来都不是自大。</p><p>正因我们的渺小，现实存在的悲喜、爱恨、痛痒才值得回味，才会有形形色色的人生足以分享，得以借鉴—原来，人就是这样地活着。我们生而渺小，却并非无足轻重。</p><p></p><p></p><span>——摘自《为你读诗》</span></div>', '/upload/img/hy10.jpg', '1', '0', '2020-11-08');
INSERT INTO `newsdetail` VALUES ('10016', '失败并不可怕，害怕失败才真正可怕。', '<div id=\"articleContent\"><p>人只有经历自己的渺小，才能到达高尚。    ——卡夫卡</p><p>遥想浩瀚无垠的宇宙，回首世世代代的先祖，我们的生命仿佛显得渺小而偶然。</p><p>在这广袤的星球上，曾有1080亿人静静地活过，又安详地消失。而今，我们活跃在拥有70亿人的星球里，成为了大千世界里的一员。</p><p>时光驯服着一切，世间风物的存在与变迁，人类精神的迷惘与觉醒。在反观自我，人之为人的孤独、脆弱、焦虑也无可规避……</p><p>换个角度来说，我们又是某种意义上的边缘人与渺小者，如一只负重前行的蜗牛，背着“无远弗届”的内核，在各自的陡坡上奋斗攀爬。可现实往往是攀爬的速度比不上父母老去的速度。随着年岁的增长，自己所背负“壳”也愈加沉重……</p><p>大千世界，每天都上演这感情“渺小”的时刻：投简历的那一刻，好像往大海里投了一粒沙行走在陌生的城市，人来人往，举目无亲面对已成定局的事，命运让你无力回天。</p><p>这些酸楚的往事，最终释放出一种意义，使人逐渐变得谦卑；那些小我所经历的悲苦，多年后再次复燃忆起，它们早已熔为身体上一块印记，成为记忆缝合点里一个不可追溯的刺点。</p><p>有时，渺小的存在，胜过了傲慢的虚空。</p><p>不如，“从今天开始，重新做自己的蜗牛。”持守这一方不被惊扰的“小千世界”。风雨如晦时，能神游安宁；人云亦云时，能超然自省；孤独委屈时，可酩酊大醉。</p><p>多想拥有这样的“自信”啊，将所有的平淡调剂成微甜。连约会前的等待，都是甜蜜的序曲。</p><p>其实，让人摆脱孤独的从来都不是喧嚣，战胜渺小的从来都不是自大。</p><p>正因我们的渺小，现实存在的悲喜、爱恨、痛痒才值得回味，才会有形形色色的人生足以分享，得以借鉴—原来，人就是这样地活着。我们生而渺小，却并非无足轻重。</p><p></p><p></p><span>——摘自《为你读诗》</span></div>', '/upload/img/hy10.jpg', '1', '0', '2020-11-11');
INSERT INTO `newsdetail` VALUES ('10017', '南方的秋天只能在日历的节气里想象。', '<div id=\"articleContent\"><p>人只有经历自己的渺小，才能到达高尚。    ——卡夫卡</p><p>遥想浩瀚无垠的宇宙，回首世世代代的先祖，我们的生命仿佛显得渺小而偶然。</p><p>在这广袤的星球上，曾有1080亿人静静地活过，又安详地消失。而今，我们活跃在拥有70亿人的星球里，成为了大千世界里的一员。</p><p>时光驯服着一切，世间风物的存在与变迁，人类精神的迷惘与觉醒。在反观自我，人之为人的孤独、脆弱、焦虑也无可规避……</p><p>换个角度来说，我们又是某种意义上的边缘人与渺小者，如一只负重前行的蜗牛，背着“无远弗届”的内核，在各自的陡坡上奋斗攀爬。可现实往往是攀爬的速度比不上父母老去的速度。随着年岁的增长，自己所背负“壳”也愈加沉重……</p><p>大千世界，每天都上演这感情“渺小”的时刻：投简历的那一刻，好像往大海里投了一粒沙行走在陌生的城市，人来人往，举目无亲面对已成定局的事，命运让你无力回天。</p><p>这些酸楚的往事，最终释放出一种意义，使人逐渐变得谦卑；那些小我所经历的悲苦，多年后再次复燃忆起，它们早已熔为身体上一块印记，成为记忆缝合点里一个不可追溯的刺点。</p><p>有时，渺小的存在，胜过了傲慢的虚空。</p><p>不如，“从今天开始，重新做自己的蜗牛。”持守这一方不被惊扰的“小千世界”。风雨如晦时，能神游安宁；人云亦云时，能超然自省；孤独委屈时，可酩酊大醉。</p><p>多想拥有这样的“自信”啊，将所有的平淡调剂成微甜。连约会前的等待，都是甜蜜的序曲。</p><p>其实，让人摆脱孤独的从来都不是喧嚣，战胜渺小的从来都不是自大。</p><p>正因我们的渺小，现实存在的悲喜、爱恨、痛痒才值得回味，才会有形形色色的人生足以分享，得以借鉴—原来，人就是这样地活着。我们生而渺小，却并非无足轻重。</p><p></p><p></p><span>——摘自《为你读诗》</span></div>', '/upload/img/hy8.jpg', '1', '0', '2020-11-24');
INSERT INTO `newsdetail` VALUES ('10018', '看一看澄净似海的天空，听一听白鸽的飞声，就不算辜负了这秋意', '<div id=\"articleContent\"><<p>人只有经历自己的渺小，才能到达高尚。    ——卡夫卡</p><p>遥想浩瀚无垠的宇宙，回首世世代代的先祖，我们的生命仿佛显得渺小而偶然。</p><p>在这广袤的星球上，曾有1080亿人静静地活过，又安详地消失。而今，我们活跃在拥有70亿人的星球里，成为了大千世界里的一员。</p><p>时光驯服着一切，世间风物的存在与变迁，人类精神的迷惘与觉醒。在反观自我，人之为人的孤独、脆弱、焦虑也无可规避……</p><p>换个角度来说，我们又是某种意义上的边缘人与渺小者，如一只负重前行的蜗牛，背着“无远弗届”的内核，在各自的陡坡上奋斗攀爬。可现实往往是攀爬的速度比不上父母老去的速度。随着年岁的增长，自己所背负“壳”也愈加沉重……</p><p>大千世界，每天都上演这感情“渺小”的时刻：投简历的那一刻，好像往大海里投了一粒沙行走在陌生的城市，人来人往，举目无亲面对已成定局的事，命运让你无力回天。</p><p>这些酸楚的往事，最终释放出一种意义，使人逐渐变得谦卑；那些小我所经历的悲苦，多年后再次复燃忆起，它们早已熔为身体上一块印记，成为记忆缝合点里一个不可追溯的刺点。</p><p>有时，渺小的存在，胜过了傲慢的虚空。</p><p>不如，“从今天开始，重新做自己的蜗牛。”持守这一方不被惊扰的“小千世界”。风雨如晦时，能神游安宁；人云亦云时，能超然自省；孤独委屈时，可酩酊大醉。</p><p>多想拥有这样的“自信”啊，将所有的平淡调剂成微甜。连约会前的等待，都是甜蜜的序曲。</p><p>其实，让人摆脱孤独的从来都不是喧嚣，战胜渺小的从来都不是自大。</p><p>正因我们的渺小，现实存在的悲喜、爱恨、痛痒才值得回味，才会有形形色色的人生足以分享，得以借鉴—原来，人就是这样地活着。我们生而渺小，却并非无足轻重。</p><p></p><p></p><span>——摘自《为你读诗》</span></div>', '/upload/img/hy8.jpg', '1', '0', '2020-11-25');
INSERT INTO `newsdetail` VALUES ('10019', '月明云聚，心安即是天涯', '<div id=\"articleContent\"><div class=\"poem\"><h4>王维诗二首</h4><h5>作者：王维</h5><p>《文杏馆》</p><p>文杏裁为梁，香茅结为宇。</p><p>不知栋里云，去作人间雨。</p><p>《竹里馆》</p><p>独坐幽篁里，弹琴复长啸。</p><p>深林人不知，明月来相照。</p></div><div class=\"comment\"><h6>诗享</h6><p>“文杏裁为梁，香茅结为宇。不知栋里云，去作人间雨”，是唐代诗人王维晚年隐居陕西蓝田辋川时所作，名曰《文杏馆》。文杏馆不仅仅是一个诗名，更是一个真实的处所，与大家熟悉的“辛夷坞”“竹里馆”“鹿柴”等，共同构成辋川二十景。王维深爱这个地方。不仅以这二十景为诗名，和好友裴迪各自写下了呼应往来的二十首诗作，更创作了单幅壁画《辋川图》。《辋川图》早已失传，传世的均为临摹之作。如果去看宋人郭忠恕的《临王维辋川图》，会发现，这幅辋川图也一一对应了诗中的二十景。我最爱的是《竹里馆》。独坐幽篁里，弹琴复长啸。深林人不知，明月来相照。一个地方，若人在其中清净无染，就会吸引明月亲近地照向我们。与明月无声相依，那真是一种绝妙的情境，超出所有娱乐。明代学者胡应麟，在读《辋川集》时曾言“身世两忘，万念皆寂”。所以，在略显慌乱的2020年，尤其是岁末，读一读王维的《辋川集》，看看他的《辋川图》，能得到疗愈。</p><p>宋代词人秦观，久病不愈。友人高符仲带着《辋川图》来看他，并对他说：“看王维的这幅画可以治病。”秦观立即让书童展开画作，在枕旁览阅，仿佛亲身来到了华子冈、文杏馆、竹里馆，与其好友裴迪诗词相和……后来，秦观将这次奇妙的观赏感受记录下来，成为珍贵的《摩诘辋川图跋》，现收藏于台北故宫博物院。可见，辋川不仅是王维心灵的栖所，更是许多人的神安之地。只可惜，辋川别业现已无存，仅有一棵相传是王维亲手种植的银杏树，还屹立于文杏馆遗址前，迄今已近1300年。前不久，我们特地来到这里，在树下捡拾了许多银杏叶。又将其刺绣在围巾上，作为留念与暗示——行到水穷处，坐看云起时。偶然值林叟，谈笑无还期。</p><span>——摘自《为你读诗》</span></div></div>', '/upload/img/poem1.jpeg', '1', '111', '2020-12-01');
INSERT INTO `newsdetail` VALUES ('10020', '木心：看清世界荒谬，会心一笑', '<div id=\"articleContent\"><div class=\"poem\"><h4>《卡夫卡的旧笔记》</h4><h5>作者：木心</h5><p>从清晨六点起</p><p>连续学习到傍晚</p><p>发觉我的左手</p><p>怜悯地握了握右手</p><p>黄昏时分</p><p>由于无聊</p><p>我三次走进浴室</p><p>洗洗这个洗洗那个</p><p>生在任何时代</p><p>我都是痛苦的</p><p>所以不要怪时代</p><p>也不要怪我</p></div><div class=\"comment\"><h6>诗享</h6><p>看卡夫卡的小说作品，压抑，扭曲又绝望的叙述，于是以为他也是时时刻刻都忧伤而绝望的。可据他朋友的回忆，卡夫卡性格并不孤僻，人生丰富多彩，朋友也不少，交谈时滔滔不绝。</p><p>也许，人都是具有两面性的。木心十分欣赏卡夫卡。他说卡夫卡高洁、诚实，又说，“凡是高洁、诚实的人，都是悲观的，都是可敬可爱的。”</p><p>“生在任何时代/我都是痛苦的”，这话是在说卡夫卡，或许是在说自己。木心的诗里，常常与历史上的人物对话，诗中的“我”与“他”时而碰撞交流，时而重叠。</p><p>少年木心，读书、看画，有一个自己的世界。然而时代动乱，他也不能独善其身。陈丹青说，木心结结实实活在“我们的时代”，饱尝他那辈人的种种侮辱。</p><p>但读他的诗，却少有愤怒的控诉。他写颓丧，可这颓丧也是静的，小心翼翼的，掩不住满心的洪福。</p><p>“款款款款低着头走/猛省这是颓丧的步姿/人们见了会慨然想/一个凄凉无告的病汉/哪知我满心洪福/款款独行，才不致倾溢”（《五岛晚邮》）</p><p>文学、艺术是他”拒绝时代“的武器。晚年回到故乡乌镇，他将所有心血倾注其中。他言“文学是一字一字地救出自己”，艺术则“是个最好的梦”。</p><p>现实暗如墨水，但生命的书写不能没有墨水，不能不碰现实，“不然生命就没有了，味道就没有了。”</p><p>法国诗人勒内·夏尔说：“理解得越多，就越痛苦。知道得越多，就越撕裂。但是，他有着同痛苦相对称的清澈，与绝望相均衡的坚韧。”</p><p>这话形容木心再合适不过。他的诗有一种天真的旷达和不循常理，现实的苦痛、颓丧被他用自己的方式化解，再用诗句缓缓铺陈。如他所说，“善意的误解赋我以生路，坎坷泥泞，还是要走。”</p><span>——摘自《为你读诗》</span></div></div>', '/upload/img/poem2.jpg', '1', '108', '2020-12-01');
INSERT INTO `newsdetail` VALUES ('10021', '沈从文：思量永远是风，是你的风', '<div id=\"articleContent\"><div class=\"poem\"><h4>《颂》</h4><h5>作者：沈从文</h5><p>说是总有那么一天，</p><p>你的身体成了我极熟的地方，</p><p>那转弯抹角，那小阜平冈；</p><p>一草一木我全都知道清清楚楚，</p><p>虽在黑暗里我也不至于迷途。</p><p>如今这一天居然来了。</p><p>我嗅惯着了你身上的香味，</p><p>如同吃惯了樱桃的竹雀；</p><p>辨得出樱桃香味。</p><p>樱桃与桑葚以及地莓味道的不同，</p><p>虽然这竹雀并不曾吃过</p><p>桑葚与地莓也明白的。</p><p>你是一株柳；</p><p>有风时是动，无风时是动：</p><p>但在大风摇你撼你一阵过后，</p><p>你再也不能动了。</p><p>我思量永远是风，是你的风。</p></div><div class=\"comment\"><h6>诗享</h6><p>​“萑苇”是易折的，“磐石”是难动的，我的生命等于“萑苇”，但爱你的心希望它如“磐石”。——沈从文</p><p>“我思量永远是风，是你的风。”这是26岁的沈从文笔端流出的宛畅之诗，当年在《新月》杂志首次刊发。</p><p>回首那段日子，他主要靠写作来维持生计，即便发表的数量很可观，花起钱来却总是糊涂，致使自己穷愁不已，无比颓丧。加之，母亲看病急需用钱，九妹的学费还在拖欠……其压力日甚一日。</p><p>沈从文曾在日记里写道——“我咀嚼自己胡涂的用钱，便想起母亲说的应当有个妻来管理的事了。”</p><p>想起诗人木心曾将爱情分为三种境界，“少年出乎好奇，青年在与审美，中年归向求知。老之将至，义无反顾。”</p><p>年少的沈从文出于好奇，向往爱情也符合心性。他执笔的作品也从未回避这个问题，“血液里铁质成分太多，精神里幻想成分太多……”可现实里他却少言寡语、卑不足道，时常苦闷纠结，认为“世界上是没有女人要我爱她的”。</p><p>至于诗里的那个“她”——是否确有其人，我们不得而知。想必，寻觅的幻想成分远多于实际的冒险经历。直至两年后，为之动心的“她”方才出现。“我行过许多地方的桥，看过许多次数的云，喝过许多种类的酒，却只爱过一个正当最好年龄的人……”</p><p>爱情是有时间性的，太早或太迟认识，结果都会谬以千里。或许，沈从文也深谙此理，才酝酿出笃定的誓言——“知道你会来，所以我等。”</p><p>年轻时，我们总以为会遇到数不胜数的人，后来才觉知，人生际遇里的机缘不过那么几次。就像困厄之时的沈从文，有幸因《新月》与胡适相识，才顺利前往吴淞中国公学任教，生活也稍稍稳定。</p><p>正巧，在中国公学遇到了成绩优异的张兆和，仿佛拨动了心灵深处那根弦，坠入爱河，并愿赌上一生。</p><p>1930年春新学期开学，张兆和竟收到了沈先生的表白信，但她表现出的却是如终如一的“顽固”。</p><p>别人对我无意中念到你的名字，我心就抖战，/身就沁汗!并不当着别人，只在那有星子的夜里，我才敢低低的喊叫你底名字。——沈从文</p><p>最终，这场爱的冒险应了那句——“只愿君心似我心，定不负相思意。”——三年之后，这位木讷平和的“乡下人”终于等到了那杯久违的甜酒。</p><p>1933年，二人的婚礼在北平中央公园举行，由胡适主婚，周作人特意为新人写了副喜联：“倾取真奇境，会同爱丽思。”</p><span>——摘自《为你读诗》</span></div></div>', '/upload/img/poem3.jpg', '1', '150', '2020-12-01');
INSERT INTO `newsdetail` VALUES ('10022', '聚散无常，愿所有的爱都有着落', '<div id=\"articleContent\"><div class=\"poem\"><h4>《晚祷》</h4><h5>作者：舒丹丹</h5><p>感谢你，赐给蔬菜和瓜果，</p><p>更兼每日灵粮，喂养我。</p><p>感谢你，你的杖与竿，</p><p>引领我，行过幽深的荫谷。</p><p>感谢你，让种子不撒进石缝，</p><p>人间的爱，都有了着落。</p><p>感谢你，你说平安，就有平安。</p><p>你说喜乐，就有喜乐。</p><p>感谢你，让灵魂像鸟儿一样飞，</p><p>不是带着叹息，乃是唱着小雅歌！</p></div><div class=\"comment\"><h6>诗享</h6><p>​说出这个词，我一脸羞愧/觉得这轻浅的词语难以叙尽我的本真/懂得感谢是善良的人——了然《感谢》</p><p>徘徊在岁末的间隙，这不寻常的一年你过得又如何呢？纷纷扰扰的故事里夹杂着层出不穷的事故，我们难免会脆弱、焦虑、无奈……</p><p>但一幕幕穿过自己的旧日子里，又存储着具象且自带暖意的段落。在阴冷的冬日，打捞沉淀其中的往事，细想一下自己被温暖包围的瞬间，便又顿然觉得人间值得。</p><p>2020年只剩35天，你是否也有很想道谢的人？</p><p>是隔离居家时，为我们日复一日操持三餐的父母；是惦念彼此，始终不曾放弃爱的恋人；是新入职场时，极力维护自己的同事；还是萍水相逢，不曾记住名字的陌生人……</p><p>感谢你，让种子不撒进石缝，人间的爱，都有了着落。</p><p>很多时候，身边人一个善意的动念或是微不足道的鼓励，就都会让颓丧的我们重获新生。</p><p>还有生活里那些便捷的日常——动动手指——外卖即刻到家，出行也无需多走，叫车软件便会为你停留在最佳的位置……</p><p>我们享受一切服务的等待时间都在缩短。就像现代学者哈特穆特·罗萨在《新异化的诞生》里所描述的——“一切都在加速，包含着我们索取的和别人向我们索取的。”</p><p>人与人之间聚散无常，每个单一的生命点，都桥接着无数个人，多留存些温热总是好的，生活也会明朗起来。</p><p>如诗人鱼玄机所言：“聚散已悲云不定，恩情须学水长流。”</p><p>想及冬日里风雪兼程的外卖员，若在每个配送的瞬间都能收获谢意，对他们而言，或许就是每日的平安喜乐吧。</p><p>感恩节虽缘起于西方，但感念之情却长存在我们每个人的心中。就像乔斯坦·贾德在《苏菲的世界》中所说：“没有人天生该对谁好，所以我们要学会感恩。”</p><p>这一年还要感谢自己，温柔善感，却不曾向困厄妥协，向破碎的生活低头。</p><p>面对种种难题，每个人都像一粒不起眼“石子”，日复一日打磨着内心理想化的世界，也被这个世界所默认的章法打磨着……</p><p>有时想想，无需感谢生命里的坎坷，最该感谢的是挺过来的自己。正是那些经历，让我们有足够的觉知，坚信自己的韧性，终会从乌云密布里看见灿然的曙光。诚如人生大起大落的诗人苏轼所言：</p><p>竹杖芒鞋轻胜马，谁怕？一蓑烟雨任平生。料峭春风吹酒醒，微冷，山头斜照却相迎。回首向来萧瑟处，归去，也无风雨也无晴。</p><p>在这万物闭藏的冬日，幸好有这样一个特别的契机“打开”我们，将那曾经填补了生活缝隙，却来不及致意的感念，温暖地说出来……</p><span>——摘自《为你读诗》</span></div></div>', '/upload/img/poem4.jpg', '1', '121', '2020-12-01');

-- ----------------------------
-- Table structure for `news_category`
-- ----------------------------
DROP TABLE IF EXISTS `news_category`;
CREATE TABLE `news_category` (
  `newsId` int NOT NULL COMMENT '新闻id，外键',
  `categoryId` smallint NOT NULL COMMENT '栏目id，外键',
  PRIMARY KEY (`newsId`,`categoryId`),
  KEY `news_cgy_fk` (`categoryId`),
  CONSTRAINT `news_ca_nefk` FOREIGN KEY (`newsId`) REFERENCES `newsdetail` (`newsId`),
  CONSTRAINT `news_cgy_fk` FOREIGN KEY (`categoryId`) REFERENCES `category` (`categoryId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of news_category
-- ----------------------------
INSERT INTO `news_category` VALUES ('10001', '11');
INSERT INTO `news_category` VALUES ('10002', '11');
INSERT INTO `news_category` VALUES ('10003', '11');
INSERT INTO `news_category` VALUES ('10004', '11');
INSERT INTO `news_category` VALUES ('10005', '11');
INSERT INTO `news_category` VALUES ('10006', '11');
INSERT INTO `news_category` VALUES ('10007', '11');
INSERT INTO `news_category` VALUES ('10008', '11');
INSERT INTO `news_category` VALUES ('10010', '11');
INSERT INTO `news_category` VALUES ('10012', '11');
INSERT INTO `news_category` VALUES ('10013', '11');
INSERT INTO `news_category` VALUES ('10014', '11');
INSERT INTO `news_category` VALUES ('10015', '11');
INSERT INTO `news_category` VALUES ('10016', '11');
INSERT INTO `news_category` VALUES ('10017', '11');
INSERT INTO `news_category` VALUES ('10018', '11');
INSERT INTO `news_category` VALUES ('10019', '11');
INSERT INTO `news_category` VALUES ('10020', '11');
INSERT INTO `news_category` VALUES ('10021', '11');
INSERT INTO `news_category` VALUES ('10022', '11');
INSERT INTO `news_category` VALUES ('10002', '12');
INSERT INTO `news_category` VALUES ('10003', '12');
INSERT INTO `news_category` VALUES ('10005', '12');
INSERT INTO `news_category` VALUES ('10011', '12');
INSERT INTO `news_category` VALUES ('10012', '12');
INSERT INTO `news_category` VALUES ('10013', '12');
INSERT INTO `news_category` VALUES ('10014', '12');
INSERT INTO `news_category` VALUES ('10015', '12');
INSERT INTO `news_category` VALUES ('10016', '12');
INSERT INTO `news_category` VALUES ('10017', '12');
INSERT INTO `news_category` VALUES ('10018', '12');
INSERT INTO `news_category` VALUES ('10019', '12');
INSERT INTO `news_category` VALUES ('10020', '12');
INSERT INTO `news_category` VALUES ('10021', '12');
INSERT INTO `news_category` VALUES ('10022', '12');
INSERT INTO `news_category` VALUES ('10004', '13');
INSERT INTO `news_category` VALUES ('10005', '13');
INSERT INTO `news_category` VALUES ('10006', '13');
INSERT INTO `news_category` VALUES ('10009', '13');
INSERT INTO `news_category` VALUES ('10010', '13');
INSERT INTO `news_category` VALUES ('10012', '13');
INSERT INTO `news_category` VALUES ('10013', '13');
INSERT INTO `news_category` VALUES ('10014', '13');
INSERT INTO `news_category` VALUES ('10015', '13');
INSERT INTO `news_category` VALUES ('10016', '13');
INSERT INTO `news_category` VALUES ('10017', '13');
INSERT INTO `news_category` VALUES ('10018', '13');
INSERT INTO `news_category` VALUES ('10019', '13');
INSERT INTO `news_category` VALUES ('10020', '13');
INSERT INTO `news_category` VALUES ('10021', '13');
INSERT INTO `news_category` VALUES ('10007', '14');
INSERT INTO `news_category` VALUES ('10008', '14');
INSERT INTO `news_category` VALUES ('10019', '14');
INSERT INTO `news_category` VALUES ('10020', '14');
INSERT INTO `news_category` VALUES ('10021', '14');
INSERT INTO `news_category` VALUES ('10022', '14');
INSERT INTO `news_category` VALUES ('10002', '15');
INSERT INTO `news_category` VALUES ('10004', '15');
INSERT INTO `news_category` VALUES ('10010', '15');
INSERT INTO `news_category` VALUES ('10012', '15');
INSERT INTO `news_category` VALUES ('10019', '15');
INSERT INTO `news_category` VALUES ('10020', '15');
INSERT INTO `news_category` VALUES ('10021', '15');
INSERT INTO `news_category` VALUES ('10022', '15');
INSERT INTO `news_category` VALUES ('10001', '16');
INSERT INTO `news_category` VALUES ('10006', '16');
INSERT INTO `news_category` VALUES ('10010', '16');
INSERT INTO `news_category` VALUES ('10013', '16');
INSERT INTO `news_category` VALUES ('10019', '16');
INSERT INTO `news_category` VALUES ('10020', '16');
INSERT INTO `news_category` VALUES ('10021', '16');
INSERT INTO `news_category` VALUES ('10022', '16');
INSERT INTO `news_category` VALUES ('10008', '17');
INSERT INTO `news_category` VALUES ('10019', '17');
INSERT INTO `news_category` VALUES ('10020', '17');
INSERT INTO `news_category` VALUES ('10021', '17');
INSERT INTO `news_category` VALUES ('10022', '17');
INSERT INTO `news_category` VALUES ('10006', '18');
INSERT INTO `news_category` VALUES ('10010', '18');
INSERT INTO `news_category` VALUES ('10019', '18');
INSERT INTO `news_category` VALUES ('10020', '18');
INSERT INTO `news_category` VALUES ('10021', '18');
INSERT INTO `news_category` VALUES ('10022', '18');
INSERT INTO `news_category` VALUES ('10002', '19');
INSERT INTO `news_category` VALUES ('10019', '19');
INSERT INTO `news_category` VALUES ('10020', '19');
INSERT INTO `news_category` VALUES ('10021', '19');
INSERT INTO `news_category` VALUES ('10022', '19');
INSERT INTO `news_category` VALUES ('10007', '20');
INSERT INTO `news_category` VALUES ('10019', '20');
INSERT INTO `news_category` VALUES ('10020', '20');
INSERT INTO `news_category` VALUES ('10021', '20');
INSERT INTO `news_category` VALUES ('10022', '20');

-- ----------------------------
-- Table structure for `news_childcomment`
-- ----------------------------
DROP TABLE IF EXISTS `news_childcomment`;
CREATE TABLE `news_childcomment` (
  `parentId` int NOT NULL COMMENT '主评论id',
  `childCommentId` int NOT NULL COMMENT '子评论id',
  `replyCommentId` int DEFAULT NULL COMMENT '鍥炲鐨勮瘎璁虹殑id',
  `newsId` int DEFAULT NULL,
  PRIMARY KEY (`childCommentId`),
  KEY `childparentIdfk` (`parentId`),
  KEY `childreplyCommentId` (`replyCommentId`),
  KEY `childnewsIdfk` (`newsId`),
  CONSTRAINT `childCommentIdfk` FOREIGN KEY (`childCommentId`) REFERENCES `commentdetails` (`commentId`),
  CONSTRAINT `childnewsIdfk` FOREIGN KEY (`newsId`) REFERENCES `news_comment` (`newsId`),
  CONSTRAINT `childparentIdfk` FOREIGN KEY (`parentId`) REFERENCES `news_comment` (`parentCommentId`),
  CONSTRAINT `childreplyCommentId` FOREIGN KEY (`replyCommentId`) REFERENCES `news_childcomment` (`childCommentId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of news_childcomment
-- ----------------------------
INSERT INTO `news_childcomment` VALUES ('1000', '1002', null, '10001');
INSERT INTO `news_childcomment` VALUES ('1000', '1003', null, '10001');
INSERT INTO `news_childcomment` VALUES ('1000', '1004', null, '10001');
INSERT INTO `news_childcomment` VALUES ('1000', '1005', null, '10001');
INSERT INTO `news_childcomment` VALUES ('1000', '1006', '1002', '10001');
INSERT INTO `news_childcomment` VALUES ('1000', '1007', '1003', '10001');
INSERT INTO `news_childcomment` VALUES ('1000', '1008', '1004', '10001');
INSERT INTO `news_childcomment` VALUES ('1000', '1009', '1007', '10001');
INSERT INTO `news_childcomment` VALUES ('999', '1010', null, '10001');
INSERT INTO `news_childcomment` VALUES ('999', '1011', '1010', '10001');
INSERT INTO `news_childcomment` VALUES ('999', '1012', null, '10001');
INSERT INTO `news_childcomment` VALUES ('999', '1013', null, '10001');
INSERT INTO `news_childcomment` VALUES ('1014', '1015', null, '10002');
INSERT INTO `news_childcomment` VALUES ('999', '1017', '1012', '10001');
INSERT INTO `news_childcomment` VALUES ('1016', '1019', null, '10001');
INSERT INTO `news_childcomment` VALUES ('1018', '1020', null, '10001');
INSERT INTO `news_childcomment` VALUES ('1018', '1021', '1020', '10001');

-- ----------------------------
-- Table structure for `news_comment`
-- ----------------------------
DROP TABLE IF EXISTS `news_comment`;
CREATE TABLE `news_comment` (
  `newsId` int NOT NULL COMMENT '新闻id',
  `parentCommentId` int NOT NULL COMMENT '主评论id',
  PRIMARY KEY (`parentCommentId`),
  KEY `parentnewsIdfk` (`newsId`),
  CONSTRAINT `parentnewsIdfk` FOREIGN KEY (`newsId`) REFERENCES `newsdetail` (`newsId`),
  CONSTRAINT `pcparentCommentIdfk` FOREIGN KEY (`parentCommentId`) REFERENCES `commentdetails` (`commentId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of news_comment
-- ----------------------------
INSERT INTO `news_comment` VALUES ('10001', '999');
INSERT INTO `news_comment` VALUES ('10001', '1000');
INSERT INTO `news_comment` VALUES ('10001', '1001');
INSERT INTO `news_comment` VALUES ('10001', '1016');
INSERT INTO `news_comment` VALUES ('10001', '1018');
INSERT INTO `news_comment` VALUES ('10002', '1014');
INSERT INTO `news_comment` VALUES ('10019', '1022');
INSERT INTO `news_comment` VALUES ('10019', '1023');
INSERT INTO `news_comment` VALUES ('10022', '1024');

-- ----------------------------
-- Table structure for `useraccount`
-- ----------------------------
DROP TABLE IF EXISTS `useraccount`;
CREATE TABLE `useraccount` (
  `userId` smallint NOT NULL AUTO_INCREMENT COMMENT '用户id，自增',
  `userName` varchar(6) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '用户账号',
  `userPwd` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '密码',
  `updateDate` datetime DEFAULT NULL,
  PRIMARY KEY (`userId`),
  UNIQUE KEY `userName` (`userName`)
) ENGINE=InnoDB AUTO_INCREMENT=1018 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of useraccount
-- ----------------------------
INSERT INTO `useraccount` VALUES ('1001', 'admin', 'wst123', null);
INSERT INTO `useraccount` VALUES ('1004', 'wst1', 'wst123', null);
INSERT INTO `useraccount` VALUES ('1008', 'spaceX', 'wst123', null);
INSERT INTO `useraccount` VALUES ('1009', 'dream', 'wst123', null);
INSERT INTO `useraccount` VALUES ('1010', 'home', 'wst123', null);
INSERT INTO `useraccount` VALUES ('1014', 'cms', 'wst123', null);
INSERT INTO `useraccount` VALUES ('1017', 'abr', 'wst123', null);

-- ----------------------------
-- Table structure for `userdetails`
-- ----------------------------
DROP TABLE IF EXISTS `userdetails`;
CREATE TABLE `userdetails` (
  `userId` smallint NOT NULL COMMENT '用户id，外键',
  `nickName` varchar(8) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '用户昵称',
  `head_img` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '用户头像路径',
  `gender` enum('0','1') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT '0' COMMENT '用户性别',
  `updateDate` datetime DEFAULT NULL,
  PRIMARY KEY (`userId`),
  CONSTRAINT `userdetails_fk_userid` FOREIGN KEY (`userId`) REFERENCES `useraccount` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='用户详情表';

-- ----------------------------
-- Records of userdetails
-- ----------------------------
INSERT INTO `userdetails` VALUES ('1001', '银河日报', '/upload/img/upload_8b4ee2916a2d5a497176309487bdc48c.jpeg', '1', '2020-12-07 08:21:20');
INSERT INTO `userdetails` VALUES ('1004', '金星日报', '/upload/img/upload_66058edae9b90a8c778c08160833fc96.jpeg', '0', null);
INSERT INTO `userdetails` VALUES ('1008', '木星日报', null, '0', null);
INSERT INTO `userdetails` VALUES ('1009', '幸运', '/upload/img/upload_1f222c2c919aa5c7cfaa615e2cb83ee2.jpeg', '1', '2020-12-07 08:34:24');
INSERT INTO `userdetails` VALUES ('1010', '虚空', '/upload/img/upload_daececcccd20f62163c6fa756bcd03c3.jpeg', '0', null);
INSERT INTO `userdetails` VALUES ('1014', '最初的美好', null, '1', null);
INSERT INTO `userdetails` VALUES ('1017', '朋友', null, '0', null);

-- ----------------------------
-- Table structure for `user_collect_news`
-- ----------------------------
DROP TABLE IF EXISTS `user_collect_news`;
CREATE TABLE `user_collect_news` (
  `userId` smallint NOT NULL,
  `newsId` int NOT NULL,
  `collectDate` date NOT NULL,
  PRIMARY KEY (`userId`,`newsId`),
  KEY `user_coll_nifk` (`newsId`),
  CONSTRAINT `user_coll_nifk` FOREIGN KEY (`newsId`) REFERENCES `newsdetail` (`newsId`),
  CONSTRAINT `user_coll_uifk` FOREIGN KEY (`userId`) REFERENCES `useraccount` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of user_collect_news
-- ----------------------------
INSERT INTO `user_collect_news` VALUES ('1009', '10001', '2020-12-06');
INSERT INTO `user_collect_news` VALUES ('1009', '10002', '2020-12-06');
INSERT INTO `user_collect_news` VALUES ('1009', '10003', '2020-12-06');
INSERT INTO `user_collect_news` VALUES ('1009', '10004', '2020-12-06');
INSERT INTO `user_collect_news` VALUES ('1009', '10005', '2020-12-06');
INSERT INTO `user_collect_news` VALUES ('1009', '10007', '2020-12-06');
INSERT INTO `user_collect_news` VALUES ('1009', '10008', '2020-12-06');
INSERT INTO `user_collect_news` VALUES ('1009', '10010', '2020-12-06');
INSERT INTO `user_collect_news` VALUES ('1009', '10013', '2020-12-06');
INSERT INTO `user_collect_news` VALUES ('1009', '10015', '2020-12-06');
INSERT INTO `user_collect_news` VALUES ('1009', '10019', '2020-12-07');
INSERT INTO `user_collect_news` VALUES ('1009', '10021', '2020-12-07');

-- ----------------------------
-- Table structure for `user_comment`
-- ----------------------------
DROP TABLE IF EXISTS `user_comment`;
CREATE TABLE `user_comment` (
  `commentId` int NOT NULL COMMENT '评论id',
  `userId` smallint NOT NULL COMMENT '发表评论者id',
  PRIMARY KEY (`commentId`),
  KEY `userId` (`userId`),
  CONSTRAINT `commentId` FOREIGN KEY (`commentId`) REFERENCES `commentdetails` (`commentId`),
  CONSTRAINT `userId` FOREIGN KEY (`userId`) REFERENCES `useraccount` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of user_comment
-- ----------------------------
INSERT INTO `user_comment` VALUES ('1002', '1001');
INSERT INTO `user_comment` VALUES ('1003', '1001');
INSERT INTO `user_comment` VALUES ('999', '1004');
INSERT INTO `user_comment` VALUES ('1000', '1004');
INSERT INTO `user_comment` VALUES ('1008', '1004');
INSERT INTO `user_comment` VALUES ('1009', '1004');
INSERT INTO `user_comment` VALUES ('1001', '1008');
INSERT INTO `user_comment` VALUES ('1004', '1008');
INSERT INTO `user_comment` VALUES ('1005', '1008');
INSERT INTO `user_comment` VALUES ('1006', '1008');
INSERT INTO `user_comment` VALUES ('1007', '1008');
INSERT INTO `user_comment` VALUES ('1010', '1009');
INSERT INTO `user_comment` VALUES ('1016', '1009');
INSERT INTO `user_comment` VALUES ('1017', '1009');
INSERT INTO `user_comment` VALUES ('1018', '1009');
INSERT INTO `user_comment` VALUES ('1019', '1009');
INSERT INTO `user_comment` VALUES ('1020', '1009');
INSERT INTO `user_comment` VALUES ('1021', '1009');
INSERT INTO `user_comment` VALUES ('1022', '1009');
INSERT INTO `user_comment` VALUES ('1023', '1009');
INSERT INTO `user_comment` VALUES ('1024', '1009');
INSERT INTO `user_comment` VALUES ('1013', '1010');
INSERT INTO `user_comment` VALUES ('1014', '1010');
INSERT INTO `user_comment` VALUES ('1015', '1010');
INSERT INTO `user_comment` VALUES ('1011', '1014');
INSERT INTO `user_comment` VALUES ('1012', '1017');

-- ----------------------------
-- Table structure for `user_follow`
-- ----------------------------
DROP TABLE IF EXISTS `user_follow`;
CREATE TABLE `user_follow` (
  `userId` smallint NOT NULL,
  `followUserId` smallint NOT NULL,
  `followDate` date NOT NULL,
  PRIMARY KEY (`userId`,`followUserId`),
  KEY `user_follow_nifk` (`followUserId`),
  CONSTRAINT `user_follow_nifk` FOREIGN KEY (`followUserId`) REFERENCES `useraccount` (`userId`),
  CONSTRAINT `user_follow_uifk` FOREIGN KEY (`userId`) REFERENCES `useraccount` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of user_follow
-- ----------------------------
INSERT INTO `user_follow` VALUES ('1009', '1001', '2020-12-07');
INSERT INTO `user_follow` VALUES ('1009', '1004', '2020-12-01');
INSERT INTO `user_follow` VALUES ('1009', '1008', '2020-12-03');
INSERT INTO `user_follow` VALUES ('1010', '1001', '2020-12-01');

-- ----------------------------
-- Table structure for `user_like`
-- ----------------------------
DROP TABLE IF EXISTS `user_like`;
CREATE TABLE `user_like` (
  `userId` smallint NOT NULL,
  `newsId` int NOT NULL,
  `likeDate` date DEFAULT NULL,
  PRIMARY KEY (`newsId`,`userId`),
  KEY `userIdfk` (`userId`),
  CONSTRAINT `newsIdfk` FOREIGN KEY (`newsId`) REFERENCES `newsdetail` (`newsId`),
  CONSTRAINT `userIdfk` FOREIGN KEY (`userId`) REFERENCES `useraccount` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of user_like
-- ----------------------------
INSERT INTO `user_like` VALUES ('1009', '10001', '2020-12-04');
INSERT INTO `user_like` VALUES ('1014', '10001', '2020-12-01');
INSERT INTO `user_like` VALUES ('1009', '10002', '2020-12-06');
INSERT INTO `user_like` VALUES ('1014', '10002', '2020-12-02');
INSERT INTO `user_like` VALUES ('1009', '10010', '2020-12-03');
INSERT INTO `user_like` VALUES ('1009', '10019', '2020-12-03');
INSERT INTO `user_like` VALUES ('1009', '10022', '2020-12-03');

-- ----------------------------
-- Table structure for `user_news`
-- ----------------------------
DROP TABLE IF EXISTS `user_news`;
CREATE TABLE `user_news` (
  `userId` smallint NOT NULL,
  `newsId` int NOT NULL,
  PRIMARY KEY (`newsId`),
  KEY `user_news_uId_fk` (`userId`),
  CONSTRAINT `user_news_nId_fk` FOREIGN KEY (`newsId`) REFERENCES `newsdetail` (`newsId`),
  CONSTRAINT `user_news_uId_fk` FOREIGN KEY (`userId`) REFERENCES `useraccount` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of user_news
-- ----------------------------
INSERT INTO `user_news` VALUES ('1001', '10001');
INSERT INTO `user_news` VALUES ('1001', '10002');
INSERT INTO `user_news` VALUES ('1001', '10003');
INSERT INTO `user_news` VALUES ('1001', '10004');
INSERT INTO `user_news` VALUES ('1001', '10005');
INSERT INTO `user_news` VALUES ('1001', '10009');
INSERT INTO `user_news` VALUES ('1001', '10010');
INSERT INTO `user_news` VALUES ('1001', '10012');
INSERT INTO `user_news` VALUES ('1001', '10013');
INSERT INTO `user_news` VALUES ('1004', '10011');
INSERT INTO `user_news` VALUES ('1004', '10016');
INSERT INTO `user_news` VALUES ('1004', '10017');
INSERT INTO `user_news` VALUES ('1004', '10018');
INSERT INTO `user_news` VALUES ('1004', '10020');
INSERT INTO `user_news` VALUES ('1004', '10021');
INSERT INTO `user_news` VALUES ('1008', '10006');
INSERT INTO `user_news` VALUES ('1008', '10007');
INSERT INTO `user_news` VALUES ('1008', '10008');
INSERT INTO `user_news` VALUES ('1008', '10014');
INSERT INTO `user_news` VALUES ('1008', '10015');
INSERT INTO `user_news` VALUES ('1008', '10019');
INSERT INTO `user_news` VALUES ('1008', '10022');

-- ----------------------------
-- View structure for `childcommentlist`
-- ----------------------------
DROP VIEW IF EXISTS `childcommentlist`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `childcommentlist` AS select `cl`.`newsId` AS `newsId`,`cl`.`commentId` AS `commentId`,`cl`.`userId` AS `userId`,`cl`.`nickName` AS `nickName`,`cl`.`head_img` AS `head_img`,`cl`.`commentContent` AS `commentContent`,`cl`.`commentDate` AS `commentDate`,`t`.`parentId` AS `parentId`,`t`.`replyUserName` AS `replyUserName` from ((select `o`.`parentId` AS `parentId`,`o`.`childCommentId` AS `childCommentId`,`ud`.`nickName` AS `replyUserName` from (((select `nc`.`parentId` AS `parentId`,`nc`.`childCommentId` AS `childCommentId`,`nc`.`replyCommentId` AS `replyCommentId` from `news_childcomment` `nc` where `nc`.`parentId` in (select `p`.`parentCommentId` AS `parentId` from `news_comment` `p`)) `o` left join `user_comment` `uc` on((`o`.`replyCommentId` = `uc`.`commentId`))) left join `userdetails` `ud` on((`uc`.`userId` = `ud`.`userId`)))) `t` left join `commentlists` `cl` on((`t`.`childCommentId` = `cl`.`commentId`))) ;

-- ----------------------------
-- View structure for `commentlists`
-- ----------------------------
DROP VIEW IF EXISTS `commentlists`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `commentlists` AS select `t`.`newsId` AS `newsId`,`uc`.`commentId` AS `commentId`,`ud`.`userId` AS `userId`,`ud`.`nickName` AS `nickName`,`ud`.`head_img` AS `head_img`,`cd`.`commentContent` AS `commentContent`,`cd`.`commentDate` AS `commentDate` from (((`userdetails` `ud` left join `user_comment` `uc` on((`ud`.`userId` = `uc`.`userId`))) left join `commentdetails` `cd` on((`uc`.`commentId` = `cd`.`commentId`))) left join (select `news_comment`.`newsId` AS `newsId`,`news_comment`.`parentCommentId` AS `commentId` from `news_comment` union all select `news_childcomment`.`newsId` AS `newsId`,`news_childcomment`.`childCommentId` AS `commentId` from `news_childcomment`) `t` on((`t`.`commentId` = `cd`.`commentId`))) ;

-- ----------------------------
-- View structure for `newlists`
-- ----------------------------
DROP VIEW IF EXISTS `newlists`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `newlists` AS select `n`.`newsId` AS `newsId`,`u`.`nickName` AS `nickName`,`u`.`userId` AS `userId`,`n`.`newsTitle` AS `newsTitle`,`n`.`newsContent` AS `newsContent`,`n`.`newsCover` AS `newsCover`,`t`.`commentNums` AS `commentNums`,`n`.`newsHot` AS `newsHot`,`n`.`newsDate` AS `newsDate` from ((`newsdetail` `n` left join (select count(0) AS `commentNums`,`commentlists`.`newsId` AS `newsId` from `commentlists` where `commentlists`.`newsId` in (select `newsdetail`.`newsId` from `newsdetail`) group by `commentlists`.`newsId`) `t` on((`n`.`newsId` = `t`.`newsId`))) left join (select `u`.`newsId` AS `newsId`,`n`.`nickName` AS `nickName`,`u`.`userId` AS `userId` from (`user_news` `u` join `userdetails` `n` on((`u`.`userId` = `n`.`userId`)))) `u` on((`n`.`newsId` = `u`.`newsId`))) ;
DROP TRIGGER IF EXISTS `deleteComment`;
DELIMITER ;;
CREATE TRIGGER `deleteComment` AFTER DELETE ON `commentdetails` FOR EACH ROW begin
delete from user_comment  where commentId = old.commentId;

delete from news_childcomment where parentId = old.commentId;
delete from news_comment where parentCommentId = old.commentId;
end
;;
DELIMITER ;
DROP TRIGGER IF EXISTS `addnewshot`;
DELIMITER ;;
CREATE TRIGGER `addnewshot` AFTER INSERT ON `user_like` FOR EACH ROW UPDATE newsdetail SET newsHot = newsHot + 1 WHERE newsId = NEW.newsId
;;
DELIMITER ;
DROP TRIGGER IF EXISTS `deletenewshot`;
DELIMITER ;;
CREATE TRIGGER `deletenewshot` AFTER DELETE ON `user_like` FOR EACH ROW update newsdetail set newsHot = newsHot - 1 where newsId = old.newsId
;;
DELIMITER ;
