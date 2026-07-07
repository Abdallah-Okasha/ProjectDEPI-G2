const books = [
  {
    id: 'book-1',
    title: 'إيكادولي',
    price: 14,
    image: '/imgs/books/ekadoly.jpg',
    author: 'حنان لاشين',
    description: 'رواية خيالية من سلسلة مملكة البلاغة، تأخذ القارئ إلى عالم مختلف مليء بالمغامرة والرموز والمعاني الإنسانية.'
  },
  {
    id: 'book-2',
    title: 'أوبال',
    price: 15,
    image: '/imgs/books/opal.jpg.jpg',
    author: 'حنان لاشين',
    description: 'الجزء الثاني من مملكة البلاغة، تستكمل الرواية رحلة الخيال والصراع الداخلي بين الخوف والشجاعة والبحث عن الحقيقة.'
  },
  {
    id: 'book-3',
    title: 'أمانوس',
    price: 16,
    image: '/imgs/books/amanos.jpg',
    author: 'حنان لاشين',
    description: 'رواية فانتازيا تدور حول عالم واسع من الأسرار والمواقف التي تختبر قوة الشخصيات وإيمانها بنفسها.'
  },
  {
    id: 'book-4',
    title: 'كويكول',
    price: 17,
    image: '/imgs/books/quikool.jpg',
    author: 'حنان لاشين',
    description: 'جزء جديد من سلسلة مملكة البلاغة، يحمل طابعًا مليئًا بالتحديات والاختيارات الصعبة داخل عالم خيالي مميز.'
  },
  {
    id: 'book-5',
    title: 'سقطرى',
    price: 18,
    image: '/imgs/books/socotra.jpg',
    author: 'حنان لاشين',
    description: 'رواية تمزج بين الغموض والخيال، وتعرض رحلة مختلفة في عالم مليء بالأحداث غير المتوقعة.'
  },
  {
    id: 'book-6',
    title: 'الزمهرير',
    price: 20,
    image: '/imgs/books/al-zamhareer.jpg',
    author: 'أحمد آل حمدان',
    description: 'رواية تحمل أجواء قوية ومليئة بالتوتر، وتكمل عالم مملكة البلاغة بأسلوب درامي وخيالي.'
  },
  {
    id: 'book-7',
    title: 'سر المكتبة',
    price: 12,
    image: '/imgs/books/secret-library.jpg',
    author: 'لجين سامح',
    description: 'كتاب مناسب لمحبي الغموض، يدور حول مكتبة تخفي أسرارًا كثيرة تقود القارئ لاكتشافات متتابعة.'
  },
  {
    id: 'book-8',
    title: 'المكتبة المفقودة',
    price: 19,
    image: '/imgs/books/lost-bookshop.jpg',
    author: 'إيفي وودز',
    description: 'رواية عن الكتب والذكريات والبحث عن الذات، تدور في أجواء دافئة لعشاق المكتبات والقصص الإنسانية.'
  },
  {
    id: 'book-9',
    title: 'الحياة رواية',
    price: 13,
    image: '/imgs/books/life-novel.jpg',
    author: 'غيوم ميسو',
    description: 'كتاب خفيف يعرض أفكارًا وتأملات عن الحياة والقراءة والإنسان بأسلوب بسيط وقريب من القارئ.'
  },
  {
    id: 'book-10',
    title: 'قصة رواية',
    price: 10,
    image: '/imgs/books/story-novel.jpg',
    author: 'توماس وولف',
    description: 'كتاب يدور حول الحكايات وكيف يمكن للرواية أن تعكس مشاعر الإنسان وتجاربه المختلفة.'
  },
  {
    id: 'book-11',
    title: 'أكابادورا',
    price: 11,
    image: '/imgs/books/accabadora.jpg',
    author: 'ميكيلا مورجيا',
    description: 'رواية إنسانية عميقة تتناول العلاقات العائلية والاختيارات الصعبة بين الرحمة والواجب.'
  },
  {
    id: 'book-12',
    title: 'الأختان',
    price: 9,
    image: '/imgs/books/the-sisters.jpg',
    author: 'ديزى جونسون',
    description: 'رواية اجتماعية تدور حول علاقة أختين وما بينهما من حب واختلاف وأسرار تؤثر على حياتهما.'
  },
  {
    id: 'book-13',
    title: 'انخدعنا',
    price: 8,
    image: '/imgs/books/enkhadana.jpg',
    author: 'دينا شحاتة',
    description: 'كتاب يناقش فكرة الخداع في العلاقات والمواقف اليومية وكيف يرى الإنسان الحقيقة بعد فوات الأوان.'
  },
  {
    id: 'book-14',
    title: 'كيف عشقت',
    price: 10,
    image: '/imgs/books/how-i-loved.jpg',
    author: 'سرين عادل',
    description: 'رواية رومانسية هادئة تتناول مشاعر الحب والتردد والقرارات التي تغير حياة الإنسان.'
  },
  {
    id: 'book-15',
    title: 'الحكم هو الموت',
    price: 18,
    image: '/imgs/books/death-sentence.jpg',
    author: 'أنتوني هوروفيتز',
    description: 'رواية جريمة وتشويق تدور حول لغز غامض وتحقيقات تكشف خيوطًا معقدة تقود إلى الحقيقة.'
  },
  {
    id: 'book-16',
    title: 'في قبوي',
    price: 8,
    image: '/imgs/books/in-my-basement.jpg',
    author: 'أحمد السعداوي',
    description: 'رواية غموض ورعب نفسي تدور حول مكان مغلق وأسرار مخيفة تظهر تدريجيًا.'
  },
  {
    id: 'book-17',
    title: 'أفراح المقبرة',
    price: 7,
    image: '/imgs/books/graveyard-joy.jpg',
    author: 'أحمد خالد توفيق',
    description: 'مجموعة قصصية ذات طابع ساخر وغامض، تجمع بين الرعب والفكرة الإنسانية بأسلوب مختلف.'
  },
  {
    id: 'book-18',
    title: 'أخطاء التربية',
    price: 10,
    image: '/imgs/books/parenting-mistakes.jpg',
    author: 'شيماء علي',
    description: 'كتاب تربوي يوضح أخطاء شائعة في التعامل مع الأطفال وتأثيرها على شخصيتهم وسلوكهم.'
  },
  {
    id: 'book-19',
    title: 'قضية ذيل القط',
    price: 18,
    image: '/imgs/books/cat-tail-case.jpg',
    author: 'ميرنا المهدي',
    description: 'رواية بوليسية من تحقيقات نوح الألفي، تدور حول جريمة غامضة وأحداث مليئة بالتشويق.'
  },
  {
    id: 'book-20',
    title: 'قضية مخالب القط',
    price: 16,
    image: '/imgs/books/cat-claws-case.jpg',
    author: 'ميرنا المهدي',
    description: 'جزء آخر من تحقيقات نوح الألفي، يقدم لغزًا جديدًا وأحداثًا سريعة لمحبي الجريمة والتحقيق.'
  }
]

export default books