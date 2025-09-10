<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Repositories\General\ConfigurationRepository;
use App\Models\Configuration;
use Illuminate\Support\Facades\Storage;

class ConfigurationSeeder extends Seeder
{
    /**
     * @var ConfigurationRepository
     */
    protected $configurationRepository;

    /**
     * ConfigurationSeeder constructor.
     *
     * @param ConfigurationRepository $configurationRepository
     */
    public function __construct(ConfigurationRepository $configurationRepository)
    {
        $this->configurationRepository = $configurationRepository;
    }

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->seedGuest();
        $this->seedFromJsonFile();
        $this->seedReservation();
        $this->seedChatbot();
    }

    private function seedGuest(): void
    {
        $guests = [
            [
                'key' => 'tagline.general',
                'group' => 'guest',
                'type' => \App\Enums\Configuration\Type::Object,
                'value' => [
                    'title' => [
                        'en' => 'ABSTEAK',
                        'id' => 'ABSTEAK',
                        'ko' => 'ABSTEAK'
                    ],
                    'description' => [
                        'en' => 'At ABSTEAK, we believe dining is more than a meal – it is an experience to remember. We combine premium quality steak with the bold and refined flavors of modern Korean cuisine. Every dish is crafted with passion, precision, and a dedication to excellence.',
                        'id' => 'Di ABSTEAK, kami percaya bahwa bersantap bukan sekadar makan – tetapi sebuah pengalaman yang berkesan. Kami memadukan steak premium berkualitas dengan cita rasa berani dan elegan dari kuliner Korea modern. Setiap hidangan disiapkan dengan penuh passion, ketelitian, dan dedikasi pada kesempurnaan.',
                        'ko' => 'ABSTEAK에서는 식사는 단순한 한 끼가 아니라 기억에 남는 경험이라고 믿습니다. 저희는 프리미엄 스테이크와 현대적인 한국 요리의 대담하고 세련된 풍미를 결합합니다. 모든 요리는 열정과 정성, 그리고 완벽을 향한 헌신으로 만들어집니다.'
                    ],
                ],
            ],
            [
                'key' => 'experience.general',
                'group' => 'guest',
                'type' => \App\Enums\Configuration\Type::Object,
                'value' => [
                    'title' => [
                        'en' => 'PREMIUM CULINARY EXPERIENCE AT ABSTEAK',
                        'id' => 'PENGALAMAN KULINER PREMIUM ABSTEAK',
                    ],
                    'subtitle' => [
                        'en' => 'Join us to taste premium steak delicacies, cutting-edge cooking techniques, and world-class service. We are ready to serve you with a culinary experience you will never forget.',
                        'id' => 'Bergabunglah dengan kami untuk merasakan kelezatan steak premium, teknik memasak terdepan, dan pelayanan berkelas dunia. Kami siap melayani Anda dengan pengalaman kuliner yang tak akan pernah Anda lupakan.',
                    ],
                    'content' => [
                        'en' => 'Join us to taste premium steak delicacies, cutting-edge cooking techniques, and world-class service. We are ready to serve you with a culinary experience you will never forget.Enjoy an exceptional dining experience at ABSteak with premium steaks prepared by experienced chefs. Every dish is crafted with high dedication to deliver unforgettable flavors and an extraordinary dining experience',
                        'id' => 'Nikmati pengalaman kuliner istimewa di ABSteak dengan hidangan steak premium yang disiapkan oleh chef berpengalaman. Setiap hidangan dibuat dengan dedikasi tinggi untuk memberikan cita rasa yang tak terlupakan dan pengalaman bersantap yang luar biasa.',
                    ]
                ],
            ],
            [
                'key' => 'chef.general',
                'group' => 'guest',
                'type' => \App\Enums\Configuration\Type::Object,
                'value' => [
                    'name' => [
                        'en' => 'ABSteak Chef',
                        'id' => 'Chef ABSteak',
                        'ko' => 'ABSteak 셰프',
                    ],
                    'quote' => [
                        'en' => 'We are committed to delivering an unforgettable dining experience, where passion meets perfection on every plate we serve.',
                        'id' => 'Kami berkomitmen menghadirkan pengalaman bersantap yang tak terlupakan, di mana hasrat bertemu kesempurnaan di setiap hidangan yang kami sajikan.',
                        'ko' => '우리는 열정과 완벽이 만나는 모든 요리에서 잊을 수 없는 다이닝 경험을 제공하기 위해 최선을 다하고 있습니다.',
                    ],
                    'description' => [
                        'en' => 'Our skilled culinary team at ABSteak combines creativity, tradition, and innovation to bring you exquisite dishes. Every detail is carefully crafted to ensure that each guest enjoys not only a meal, but also a memorable journey of flavors.',
                        'id' => 'Tim kuliner ahli di ABSteak memadukan kreativitas, tradisi, dan inovasi untuk menghadirkan hidangan istimewa. Setiap detail dirancang dengan cermat agar setiap tamu menikmati bukan hanya sebuah santapan, melainkan juga perjalanan rasa yang berkesan.',
                        'ko' => 'ABSteak의 숙련된 요리팀은 창의성, 전통, 그리고 혁신을 결합하여 정교한 요리를 선보입니다. 세심하게 준비된 모든 디테일은 손님들이 단순한 식사가 아닌 특별한 맛의 여정을 즐길 수 있도록 합니다.',
                    ],
                ],
            ],
            [
                'key' => 'chef.image',
                'group' => 'guest',
                'type' => \App\Enums\Configuration\Type::String,
                'value' => (function () {
                    $sourcePath = public_path('assets/images/img_chef.webp');
                    $fileName   = 'img_chef.webp';
                    $targetPath = "images/{$fileName}";

                    if (file_exists($sourcePath)) {
                        // timpa jika sudah ada
                        if (Storage::disk('public')->exists($targetPath)) {
                            Storage::disk('public')->delete($targetPath);
                        }

                        Storage::disk('public')->putFileAs(
                            'images',
                            new \Illuminate\Http\File($sourcePath),
                            $fileName
                        );

                        return $targetPath; // <-- ini yang tersimpan di DB
                    }

                    return null;
                })(),
            ],
            [
                'key' => 'highlight.general',
                'group' => 'guest',
                'type' => \App\Enums\Configuration\Type::Object,
                'value' => [
                    'title' => [
                        'en' => 'ABSteak Culinary Excellence',
                        'id' => 'Kuliner ABSteak',
                        'ko' => 'ABSteak 요리의 완벽',
                    ],
                    'subtitle' => [
                        'en' => 'Discover the secrets behind our exceptional premium steak flavors',
                        'id' => 'Jelajahi secret di balik hidangan steak premium kami',
                        'ko' => '우리의 우수한 프리미엄 스테이크 맛의 비밀을 탐험하세요',
                    ],
                    'description' => [
                        'en' => 'With high dedication to quality and innovation, we deliver an unforgettable culinary experience through every dish we serve',
                        'id' => 'Dengan dedikasi tinggi terhadap kualitas dan inovasi, kami menyajikan pengalaman kuliner tak terlupakan melalui setiap hidangan yang kami sajikan',
                        'ko' => '우리는 열정과 완벽이 만나는 모든 요리에서 잊을 수 없는 다이닝 경험을 제공하기 위해 최선을 다하고 있습니다.',
                    ],
                    'items' => [
                        [
                            'en' => 'Premium high-quality meat selectively chosen for excellence',
                            'id' => 'Daging premium berkualitas tinggi yang dipilih secara selectif untuk kualitas terbaik',
                            'ko' => '우수한 품질의 고급 메인을 선택하여 완벽한 맛을 제공합니다.',
                        ],
                        [
                            'en' => 'Expertly crafted dishes with a focus on quality and flavor',
                            'id' => 'Dish yang disusun dengan teliti untuk kualitas dan cita rasa',
                            'ko' => '고급 메인을 선택하여 완벽한 맛을 제공합니다.',
                        ],
                        [
                            'en' => 'Professional cooking techniques with international standards',
                            'id' => 'Teknik memasak profesional dengan standar internasional',
                            'ko' => '국제 표준을 준수한 전문 요리 기술',
                        ],
                        [
                            'en' => 'Carefully selected spices and seasonings creating authentic and appetizing flavors',
                            'id' => 'Bumbu dan seasonings yang dipilih dengan teliti untuk cita rasa yang autentik dan memuaskan',
                            'ko' => '국제 표준을 준수한 전문 요리 기술',
                        ]
                    ]
                ],
            ],
            [
                'key' => 'highlight.preview',
                'group' => 'guest',
                'type' => \App\Enums\Configuration\Type::Object,
                'value' => [
                    'thumbnail' => (function () {
                        $sourcePath = public_path('assets/images/img_preview_thumbnail.webp');
                        $fileName   = 'img_preview_thumbnail.webp';
                        $targetPath = "images/{$fileName}";

                        if (file_exists($sourcePath)) {
                            // timpa jika sudah ada
                            if (Storage::disk('public')->exists($targetPath)) {
                                Storage::disk('public')->delete($targetPath);
                            }

                            Storage::disk('public')->putFileAs(
                                'images',
                                new \Illuminate\Http\File($sourcePath),
                                $fileName
                            );

                            return $targetPath; // <-- ini yang tersimpan di DB
                        }

                        return null;
                    })(),
                    'url' => (function () {
                        $sourcePath = public_path('assets/videos/vid_preview.mp4');
                        $fileName   = 'vid_preview.mp4';
                        $targetPath = "videos/{$fileName}";

                        if (file_exists($sourcePath)) {
                            // timpa jika sudah ada
                            if (Storage::disk('public')->exists($targetPath)) {
                                Storage::disk('public')->delete($targetPath);
                            }

                            Storage::disk('public')->putFileAs(
                                'videos',
                                new \Illuminate\Http\File($sourcePath),
                                $fileName
                            );

                            return $targetPath; // <-- ini yang tersimpan di DB
                        }

                        return null;
                    })(),
                ],
            ],
            [
                'key' => 'experience.general',
                'group' => 'guest',
                'type' => \App\Enums\Configuration\Type::Object,
                'value' => [
                    'title' => [
                        'en' => 'Experience',
                        'id' => 'Pengalaman',
                        'ko' => '경험',
                    ],
                    'subtitle' => [
                        'en' => 'Join us to taste premium steak delicacies, cutting-edge cooking techniques, and world-class service. We are ready to serve you with a culinary experience you will never forget.',
                        'id' => 'Gabung kami untuk menikmati hidangan steak premium, teknik memasak canggih, dan layanan kelas dunia. Kami siap menyajikan pengalaman kuliner yang akan Anda ingat selamanya.',
                        'ko' => '우리는 열정과 완벽이 만나는 모든 요리에서 잊을 수 없는 다이닝 경험을 제공하기 위해 최선을 다하고 있습니다.',
                    ],
                    'content' => [
                        'en' => 'Join us to taste premium steak delicacies, cutting-edge cooking techniques, and world-class service. We are ready to serve you with a culinary experience you will never forget.Enjoy an exceptional dining experience at ABSteak with premium steaks prepared by experienced chefs. Every dish is crafted with high dedication to deliver unforgettable flavors and an extraordinary dining experience',
                        'id' => 'Nikmati pengalaman kuliner istimewa di ABSteak dengan hidangan steak premium yang disiapkan oleh chef berpengalaman. Setiap hidangan dibuat dengan dedikasi tinggi untuk memberikan cita rasa yang tak terlupakan dan pengalaman bersantap yang luar biasa.',
                        'ko' => '우리는 열정과 완벽이 만나는 모든 요리에서 잊을 수 없는 다이닝 경험을 제공하기 위해 최선을 다하고 있습니다.',
                    ],
                ],
            ],
            [
                'key' => 'menu.general',
                'group' => 'guest',
                'type' => \App\Enums\Configuration\Type::Object,
                'value' => [
                    'title' => [
                        'en' => 'SIGNATURE MENU',
                        'id' => 'MENU PEMINAT',
                        'ko' => '시그니처 메뉴',
                    ],
                    'subtitle' => [
                        'en' => 'Experience culinary excellence with our carefully curated selection of dishes, crafted by world-class chefs using the finest ingredients.',
                        'id' => 'Nikmati pengalaman kuliner istimewa dengan pilihan hidangan yang dipilih dengan teliti oleh chef berpengalaman menggunakan bahan-bahan terbaik.',
                        'ko' => '우리는 열정과 완벽이 만나는 모든 요리에서 잊을 수 없는 다이닝 경험을 제공하기 위해 최선을 다하고 있습니다.',
                    ]
                ]
            ],
            [
                'key' => 'contact.general',
                'group' => 'guest',
                'type' => \App\Enums\Configuration\Type::Object,
                'value' => [
                    'title' => [
                        'en' => 'Contact',
                        'id' => 'Kontak',
                        'ko' => '연락처',
                    ],
                    'subtitle' => [
                        'en' => 'Contact us for any inquiries or reservations.',
                        'id' => 'Hubungi kami untuk pertanyaan atau reservasi.',
                        'ko' => '연락처를 통해 문의나 예약을 하실 수 있습니다.',
                    ],
                ],
            ],
            [
                'key'   => 'contact.info',
                'group' => 'guest',
                'type'  => \App\Enums\Configuration\Type::Object,
                'value' => [
                    'title' => [
                        'en' => 'visit our restaurant',
                        'id' => 'Kunjungi restoran kami',
                        'ko' => '식당을 방문하세요',
                    ],
                    'description' => [
                        'en' => 'Contact us for any inquiries or reservations.',
                        'id' => 'Hubungi kami untuk pertanyaan atau reservasi.',
                        'ko' => '연락처를 통해 문의나 예약을 하실 수 있습니다.',
                    ],
                    'email'   => 'info@example.com',
                    'phone'   => '+62 812-3456-7890',
                    'address' => 'Jl. Merdeka No. 123, Jakarta, Indonesia',
                    'map'     => [
                        'latitude'  => '-6.200000',
                        'longitude' => '106.816666',
                    ]
                ],
            ],
            [
                'key'   => 'contact.social',
                'group' => 'guest',
                'type'  => \App\Enums\Configuration\Type::Object,
                'value' => [
                    'facebook'  => 'https://facebook.com/example',
                    'twitter'   => 'https://twitter.com/example',
                    'instagram' => 'https://instagram.com/example',
                    'youtube'   => 'https://youtube.com/@example',
                ],
            ],
        ];

        foreach ($guests as $guest) {
            if ($guest['value'] instanceof \Closure) {
                $guest['value'] = $guest['value']();
            }

            // Skip if value is null after closure execution
            if ($guest['value'] === null) {
                continue;
            }

            if (
                in_array($guest['type'], [\App\Enums\Configuration\Type::Array, \App\Enums\Configuration\Type::Object])
                && (is_array($guest['value']) || is_object($guest['value']))
            ) {
                $guest['value'] = json_encode($guest['value']);
            }

            // Use repository to create or update configuration
            $this->configurationRepository->updateOrCreate(
                ['key' => $guest['key'], 'group' => $guest['group']],
                [
                    'value' => $guest['value'],
                    'type' => $guest['type']
                ]
            );
        }
    }

    private function seedFromJsonFile(): void
    {
        $jsonPath = storage_path('app/public/data/configuration-seeder.json');

        if (!file_exists($jsonPath)) {
            $this->command->warn('Configuration seeder JSON file not found at: ' . $jsonPath);
            return;
        }

        $configurations = json_decode(file_get_contents($jsonPath), true);

        if (!$configurations) {
            $this->command->warn('Invalid JSON in configuration seeder file');
            return;
        }

        foreach ($configurations as $config) {
            $type = match ($config['type']) {
                'string' => \App\Enums\Configuration\Type::String,
                'integer' => \App\Enums\Configuration\Type::Integer,
                'float' => \App\Enums\Configuration\Type::Float,
                'boolean' => \App\Enums\Configuration\Type::Boolean,
                'array' => \App\Enums\Configuration\Type::Array,
                'object' => \App\Enums\Configuration\Type::Object,
                default => \App\Enums\Configuration\Type::String,
            };

            $value = $config['value'];

            // JSON encode arrays and objects for storage
            if (in_array($type, [\App\Enums\Configuration\Type::Array, \App\Enums\Configuration\Type::Object]) && (is_array($value) || is_object($value))) {
                $value = json_encode($value);
            }

            $this->configurationRepository->updateOrCreate(
                ['key' => $config['key']],
                [
                    'group' => $config['group'],
                    'value' => $value,
                    'type' => $type,
                ]
            );
        }

        $this->command->info('Configurations seeded from JSON file successfully.');
    }

    private function seedReservation(): void
    {
        $reservations = [
            [
                'key' => 'max_day_reservation_date',
                'type' => \App\Enums\Configuration\Type::Integer,
                'value' => 14,
            ],
        ];

        foreach ($reservations as $reservation) {
            $this->configurationRepository->updateOrCreate(
                [
                    'key' => $reservation['key'],
                ],
                [
                    'type' => $reservation['type'],
                    'value' => $reservation['value'],
                    'group' => 'reservation',
                ]
            );
        }
    }

    private function seedChatbot(): void
    {
        $chatbots = [
            [
                'key' => 'assistant_chatid',
                'type' => \App\Enums\Configuration\Type::String,
                'value' => '7c403eaf-552f-439c-9bad-699549030edb',
            ],
            [
                'key' => 'reservation_chatid',
                'type' => \App\Enums\Configuration\Type::String,
                'value' => 'c1b39e43-0ac5-4ac2-8c23-986dec8a1b16',
            ],
            [
                'key' => 'asking_chatid',
                'type' => \App\Enums\Configuration\Type::String,
                'value' => '48de0e39-a6a9-4629-8909-900d0b004bed',
            ],
        ];

        foreach ($chatbots as $chatbot) {
            $this->configurationRepository->updateOrCreate(
                [
                    'key' => $chatbot['key'],
                ],
                [
                    'type' => $chatbot['type'],
                    'value' => $chatbot['value'],
                    'group' => 'chatbot',
                ]
            );
        }
    }
}
