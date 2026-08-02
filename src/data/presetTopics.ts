import { ExplorationSession } from '../types';

export const LANDING_LOGO_URL = "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=400&q=80";

export const VOLCANO_EXTERIOR_URL = "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=1200&q=80";

export const MAGMA_CHAMBER_MAIN_URL = "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80";

export const MAGMA_CHAMBER_THUMB_URL = "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80";

export const PRESET_VOLCANO: ExplorationSession = {
  id: 'volcano-default',
  topic: 'Túi Dung Nham Núi Lửa',
  currentDepthIndex: 2,
  totalLayers: 5,
  createdAt: new Date().toISOString(),
  bookmarked: true,
  layers: [
    {
      depthIndex: 1,
      depthLabel: "ĐỘ SÂU: 0KM (BỀ MẶT)",
      title: "Hình 13: Bề Mặt Núi Lửa Tầng Ngủ Yên",
      subtitle: "Địa hình bề mặt, miệng núi lửa và các trầm tích khoáng vật xung quanh",
      imageUrl: VOLCANO_EXTERIOR_URL,
      imageAlt: "Bản vẽ minh họa cổ điển bề mặt ngọn núi lửa",
      summary: "Tại bề mặt Trái Đất, một ngọn núi lửa tầng hiện lên với hình nón cao vút được cấu tạo từ các lớp dung nham đông cứng, tro núi lửa, đá bọt và đá vụn. Những nét vẽ mực tỉ mỉ kết hợp gam màu đất ấm phác họa các sườn dốc bị bào mòn qua nhiều thế kỷ ngủ yên.",
      keyMetrics: [
        { label: "Độ Cao Bề Mặt", value: "3.776 mét" },
        { label: "Nhiệt Độ Bề Mặt", value: "15°C" },
        { label: "Loại Đá Chủ Đạo", value: "Andesite & Basalt" }
      ],
      hotspots: [
        { id: "h1", x: 48, y: 25, label: "Miệng Núi Lửa Trục Chính", description: "Lõm trung tâm hình thành do các vụ phun trào nổ hoặc sự sụp đổ khi dung nham rút bớt." },
        { id: "h2", x: 68, y: 55, label: "Dòng Thạch Anh & Dòng Khí Nóng", description: "Hỗn hợp mật độ cao gồm các mảnh đá và khí cực hot lao xuống sườn núi với tốc độ lớn." },
        { id: "h3", x: 30, y: 65, label: "Cửa Khí Núi Lửa (Fumarole)", description: "Các khe hở giải phóng khí núi lửa như hơi nước, carbon dioxide và sulfur dioxide." }
      ],
      quiz: [
        {
          id: "q1",
          question: "Vật liệu chính nào tạo nên các lớp sườn dốc của núi lửa tầng?",
          options: ["Cát và đá hoa cương", "Các lớp xen kẽ dung nham, tro và đá vụn", "Trầm tích đá vôi thuần khiết", "Băng trôi và bùn quánh"],
          correctAnswerIndex: 1,
          explanation: "Núi lửa tầng tích tụ qua thời gian nhờ các đợt phun trào xen kẽ giữa dung nham lỏng và tro bụi."
        }
      ],
      suggestedNextTopics: [
        "Khoan sâu đến Ống Dẫn Trung Tâm (5KM)",
        "Khoan sâu đến Túi Dung Nham (15KM)",
        "Phân tích Thành Phần Khí Núi Lửa"
      ],
      audioScript: "Lớp 1: Bề mặt núi lửa tầng ngủ yên. Nhìn từ trên cao, ngọn núi là cấu trúc hình nón đắp nổi từ vô số đợt dung nham và tro bụi tích tụ."
    },
    {
      depthIndex: 2,
      depthLabel: "ĐỘ SÂU: 15KM",
      title: "Hình 14: Lát Cắt Núi Lửa & Túi Dung Nham",
      subtitle: "Bể chứa dung nham ngầm, sườn xâm nhập mạch bằng và mạng lưới ống dẫn áp suất cao",
      imageUrl: MAGMA_CHAMBER_MAIN_URL,
      imageAlt: "Sơ đồ minh họa chi tiết cắt ngang túi dung nham và các tầng đá ngầm",
      summary: "Đi sâu 15 km vào vỏ Trái Đất lộ ra một bể chứa đá nóng chảy khổng lồ nằm ngay dưới ngọn núi lửa. Dưới nhiệt độ khắc nghiệt và áp suất địa tĩnh khủng giáp, dung nham bị nén lại trong một mạng lưới phức tạp gồm các mạch sập, mạch dầm và các hốc rỗng.",
      keyMetrics: [
        { label: "Nhiệt Độ Dung Nham", value: "1.100°C - 1.300°C" },
        { label: "Áp Suất Địa Tĩnh", value: "4,2 kbar" },
        { label: "Thể Tích Túi Chứa", value: "~120 km³" }
      ],
      hotspots: [
        { id: "h21", x: 50, y: 20, label: "Miệng Núi & Khói Phun", description: "Ống dẫn chính đưa khí và cột tro bụi phun trào thẳng lên bầu khí quyển." },
        { id: "h22", x: 49, y: 72, label: "Lõi Túi Dung Nham", description: "Bể chứa ngầm chính lưu trữ khoáng vật silicate nóng chảy dưới nguồn năng lượng nhiệt cực lớn." },
        { id: "h23", x: 74, y: 52, label: "Mạch Dầm Ngang (Sill)", description: "Các lớp dung nham xâm nhập ngang giữa các tầng đá trầm tích cổ xưa." },
        { id: "h24", x: 26, y: 48, label: "Ống Dẫn Chính (Conduit)", description: "Đường ống thẳng đứng dẫn dung nham áp suất cao từ túi ngầm dâng lên bề mặt." }
      ],
      quiz: [
        {
          id: "q21",
          question: "Tên gọi của mạch dung nham xâm nhập nằm ngang giữa các lớp đá là gì?",
          options: ["Mạch đứng (Dike)", "Mạch dầm (Sill)", "Miệng sụp (Caldera)", "Khối vòm (Batholith)"],
          correctAnswerIndex: 1,
          explanation: "Mạch dầm (Sill) là lớp dung nham đâm ngang song song với các nếp lớp đá có sẵn."
        },
        {
          id: "q22",
          question: "Yếu tố nào giữ cho túi dung nham ở trạng thái lỏng ở độ sâu 15km?",
          options: ["Nhiệt lượng lòng đất & áp suất địa tĩnh cực cao", "Bức xạ mặt trời", "Thủy triều ngầm", "Khí oxy khí quyển"],
          correctAnswerIndex: 0,
          explanation: "Nhiệt lượng từ manti sâu cùng trọng lượng hàng kilômét vỏ Trái Đất phía trên duy trì trạng thái nóng chảy nén."
        }
      ],
      suggestedNextTopics: [
        "Khoan sâu đến Ranh Giới Vỏ - Lớp Phủ (35KM)",
        "Khám phá Sự Kết Tinh Phân Đoạn Dung Nham",
        "Quan sát Quá Trình Tạo Bọt Khí Núi Lửa"
      ],
      audioScript: "Lớp 2: Lát cắt núi lửa và túi dung nham ở độ sâu 15 km. Đây là nơi chứa hơn 100 kilômét khối dung nham rực cháy ở nhiệt độ trên 1.200 độ C."
    },
    {
      depthIndex: 3,
      depthLabel: "ĐỘ SÂU: 35KM",
      title: "Hình 15: Ranh Giới Moho & Chân Vỏ Trái Đất",
      subtitle: "Giới hạn địa chấn ngăn cách vỏ lục địa và lớp phủ trên",
      imageUrl: MAGMA_CHAMBER_THUMB_URL,
      imageAlt: "Tranh vẽ minh họa các tầng địa chấn tại ranh giới Moho",
      summary: "Ở độ sâu 35 kilômét là ranh giới Mohorovičić (Moho)—ngưỡng địa chất nơi đá đá hoa cương vỏ lục địa mật độ thấp nhường chỗ cho đá peridotite lớp phủ đặc hơn. Tại đây dung nham dâng lên bị chặn lại, làm nóng chảy các tầng đá xung quanh.",
      keyMetrics: [
        { label: "Độ Sâu Ranh Giới", value: "35 kilômét" },
        { label: "Vận Tốc Sóng P", value: "8,1 km/s" },
        { label: "Áp Suất Môi Trường", value: "10,5 kbar" }
      ],
      hotspots: [
        { id: "h31", x: 50, y: 35, label: "Vùng Tích Tụ Đáy Vỏ", description: "Dung nham basalt đặc đọng lại dưới đáy vỏ lục địa." },
        { id: "h32", x: 30, y: 65, label: "Tầng Đá Peridotite", description: "Đá siêu thạch giàu khoáng vật olivine và pyroxene cấu tạo nên lớp phủ." }
      ],
      quiz: [
        {
          id: "q31",
          question: "Ranh giới địa chấn nào đánh dấu điểm tiếp giáp giữa vỏ và lớp phủ Trái Đất?",
          options: ["Ranh giới Gutenberg", "Ranh giới Mohorovičić (Moho)", "Ranh giới Conrad", "Ranh giới Lehmann"],
          correctAnswerIndex: 1,
          explanation: "Được phát hiện bởi Andrija Mohorovičić năm 1909, Moho đánh dấu sự gia tăng đột ngột của vận tốc sóng địa chấn."
        }
      ],
      suggestedNextTopics: [
        "Khoan sâu đến Cột Nhiệt Lớp Phủ (150KM)",
        "Xem Cấu Trúc Tinh Thể Olivine",
        "Phân Tích Cơ Chế Chấn Động Sâu"
      ],
      audioScript: "Lớp 3: Ranh giới Mohorovičić tại độ sâu 35 km. Ranh giới quan trọng này phân tách vỏ lục địa nhẹ với lớp phủ đặc ở phía dưới."
    },
    {
      depthIndex: 4,
      depthLabel: "ĐỘ SÂU: 150KM",
      title: "Hình 16: Quyển Mềm & Cột Nhiệt Lớp Phủ",
      subtitle: "Dòng đối lưu rắn dẻo và sự nóng chảy giảm áp trong vùng vận tốc thấp",
      imageUrl: MAGMA_CHAMBER_MAIN_URL,
      imageAlt: "Minh họa cột đối lưu nhiệt nóng chảy ở quyển mềm",
      summary: "Sâu trong quyển mềm ở độ sâu 150 km, đá không lỏng hoàn toàn mà ở dạng rắn dẻo chảy rất chậm qua hàng triệu năm. Sự nóng chảy giảm áp trong các cột nhiệt bốc lên tạo ra nguồn dung nham basalt ban đầu nuôi dưỡng các chuỗi núi lửa.",
      keyMetrics: [
        { label: "Nhiệt Độ", value: "1.450°C" },
        { label: "Tốc Độ Dòng Chảy", value: "5 cm/năm" },
        { label: "Tỷ Lệ Nóng Chảy", value: "1,5% - 5%" }
      ],
      hotspots: [
        { id: "h41", x: 50, y: 40, label: "Thân Cột Nhiệt", description: "Dòng nhiệt bốc lên từ sâu trong tầng ranh giới nhiệt của Trái Đất." },
        { id: "h42", x: 70, y: 70, label: "Vùng Nóng Chảy Giảm Áp", description: "Khi đá dâng lên, áp suất giảm làm hạ điểm nóng chảy, tạo ra dòng dung nham lỏng." }
      ],
      quiz: [
        {
          id: "q41",
          question: "Đá ở độ sâu 150km nóng chảy thế nào khi bốc lên mà không cần thêm nhiệt ngoài?",
          options: ["Nóng chảy giảm áp khi dâng lên vùng áp suất thấp hơn", "Ma sát từ thiên thạch đi qua", "Phản ứng hạt nhân", "Sự nở ra của nước đá"],
          correctAnswerIndex: 0,
          explanation: "Nóng chảy giảm áp xảy ra khi đá mantle bốc lên đoạn nhiệt; áp giảm làm hạ điểm chảy."
        }
      ],
      suggestedNextTopics: [
        "Khoan sâu đến Ranh Giới Lõi - Lớp Phủ (2900KM)",
        "Nghiên Cứu Động Lực Học Ô Đối Lưu Mantle",
        "Theo Dấu Đồng Vị Dung Nham"
      ],
      audioScript: "Lớp 4: Quyển mềm và cột nhiệt mantle ở độ sâu 150 km. Đá rắn dẻo từ từ cuộn chảy lên trên, giảm áp để tạo thành dung nham núi lửa."
    },
    {
      depthIndex: 5,
      depthLabel: "ĐỘ SÂU: 2900KM",
      title: "Hình 17: Ranh Giới Lõi - Lớp Phủ (Lớp D'')",
      subtitle: "Động cơ nhiệt tối thượng cung cấp năng lượng cho Từ Trường và Núi Lửa",
      imageUrl: MAGMA_CHAMBER_THUMB_URL,
      imageAlt: "Sơ đồ giải phẫu động cơ nhiệt tại ranh giới lõi ngoài Trái Đất",
      summary: "Ở độ sâu kinh ngạc 2.900 kilômét, chúng ta chạm tới lớp D''—ranh giới biến động giữa lớp phủ silicate rắn và lõi ngoài sắt-niken lỏng. Nhiệt độ truyền từ lõi ngoài 4.000°C tạo động lực cho các cột nhiệt khổng lồ dâng ngược trở lại bề mặt.",
      keyMetrics: [
        { label: "Nhiệt Độ Lõi", value: "4.000°C - 5.000°C" },
        { label: "Độ Sâu Ranh Giới", value: "2.890 kilômét" },
        { label: "Trạng Thái Lõi Ngoài", value: "Sắt - Niken Lỏng" }
      ],
      hotspots: [
        { id: "h51", x: 50, y: 50, label: "Vùng Vận Tốc Cực Thấp (ULVZ)", description: "Các vùng mỏng tại ranh giới lõi-lớp phủ có tốc độ sóng địa chấn giảm mạnh và nóng chảy một phần." }
      ],
      quiz: [
        {
          id: "q51",
          question: "Nguồn nhiệt năng nào thúc đẩy các cột nhiệt sâu bên trong Trái Đất?",
          options: ["Nhiệt dẫn truyền từ lõi ngoài sắt lỏng nóng 4.500°C", "Ánh sáng mặt trời chiếu vào", "Thủy triều mặt trăng", "Dòng hải lưu đại dương"],
          correctAnswerIndex: 0,
          explanation: "Ranh giới lõi-lớp phủ đóng vai trò như một bộ trao đổi nhiệt khổng lồ giữa lõi nóng chảy và mantle."
        }
      ],
      suggestedNextTopics: [
        "Khám phá Động Cơ Địa Từ Trường Trái Đất",
        "So sánh với Rễ Núi Lửa Sao Hỏa",
        "Quay lại Bề Mặt Núi Lửa (0KM)"
      ],
      audioScript: "Lớp 5: Ranh giới Lõi - Lớp Phủ ở độ sâu 2.900 km. Đây là trái tim nhiệt lượng của hành tinh, nơi sắt lỏng 4.500 độ C cấp năng lượng cho các đợt phun trào."
    }
  ]
};

export const FEATURED_PRESETS = [
  {
    id: 'volcano',
    title: 'Túi Dung Nham Núi Lửa',
    subtitle: '5 Lớp • Từ Miệng Núi Lửa xuống tới Ranh Giới Lõi-Mantle 2.900km',
    icon: 'volcano',
    category: 'Địa Chất & Trái Đất',
    sampleDepth: '0KM → 2.900KM',
    session: PRESET_VOLCANO
  },
  {
    id: 'brain',
    title: 'Cấu Trúc Thần Kinh Não Bộ',
    subtitle: '5 Lớp • Từ Vỏ Não Đến Các Túi Synapse & Kênh Ion Mô',
    icon: 'psychology',
    category: 'Sinh Học & Thần Kinh',
    sampleDepth: 'Vỏ Não Vĩ Mô → Synapse 0.1nm',
    session: null
  },
  {
    id: 'blackhole',
    title: 'Cấu Trúc Hố Đen Siêu Tỷ Trọng',
    subtitle: '5 Lớp • Từ Đĩa Tích Tụ Đến Chân Trời Sự Cố & Điểm Kỳ Dị',
    icon: 'blur_circular',
    category: 'Vật Lý Thiên Văn',
    sampleDepth: '100 AU → Thước Đo Planck',
    session: null
  },
  {
    id: 'quantum-atom',
    title: 'Nguyên Tử Lượng Tử & Hạt Quark',
    subtitle: '5 Lớp • Từ Mây Electron Đến Hạt Nhân, Quark & Bọt Lượng Tử',
    icon: 'grain',
    category: 'Vật Lý Lượng Tử',
    sampleDepth: '10⁻¹⁰m → 10⁻³⁵m (Planck)',
    session: null
  },
  {
    id: 'pyramid',
    title: 'Căn Hầm Ngầm Kim Tự Tháp Giza',
    subtitle: '5 Lớp • Từ Lớp Đá Vôi Ngoài Đến Phòng Đại Đế & Hành Lang Ẩn',
    icon: 'account_balance',
    category: 'Lịch Sử & Khảo Cổ',
    sampleDepth: 'Đỉnh Đỉnh → Đáy Đá Nền Ngầm',
    session: null
  },
  {
    id: 'ocean',
    title: 'Ống Thuỷ Nhiệt Rãnh Mariana',
    subtitle: '5 Lớp • Từ Tầng Nắng Đến Đáy Biển Vực Sâu 11.000m',
    icon: 'water',
    category: 'Hải Dương Học',
    sampleDepth: '0m → 11.000m Đáy Biển',
    session: null
  }
];
