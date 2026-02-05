import type { BibleCharacter } from '../types/character'

export const bibleCharacters: BibleCharacter[] = [
  {
    id: 'abraham',
    name: 'Abraham',
    reference: { bookId: 'GEN', chapter: 12, verse: 1 },
    content: [
      'Abraham (originally Abram) is called the father of faith. God called him to leave Ur and go to Canaan, promising to make him a great nation and bless all peoples through him (Genesis 12:1–3).',
      'He is known for his willingness to offer Isaac on Mount Moriah, and for his hospitality and intercession. The covenant with Abraham is central to both the Old and New Testaments.',
    ],
  },
  {
    id: 'moses',
    name: 'Moses',
    reference: { bookId: 'EXO', chapter: 3, verse: 4 },
    content: [
      'Moses was chosen by God to lead Israel out of Egypt. He encountered God at the burning bush (Exodus 3) and received the law on Mount Sinai.',
      'He is regarded as the great lawgiver and prophet; Deuteronomy records his final speeches before Israel entered the Promised Land. He did not enter Canaan himself but saw it from Mount Nebo.',
    ],
  },
  {
    id: 'aaron',
    name: 'Aaron',
    reference: { bookId: 'EXO', chapter: 4, verse: 14 },
    content: [
      'Aaron was Moses’ brother and the first high priest of Israel. He served as Moses’ spokesman before Pharaoh and was appointed with his sons to the priesthood (Exodus 28–29).',
      'He is also remembered for the incident of the golden calf (Exodus 32). The Aaronic priesthood continued until the time of the New Testament.',
    ],
  },
  {
    id: 'david',
    name: 'David',
    reference: { bookId: '1SA', chapter: 16, verse: 13 },
    content: [
      'David was Israel’s second king, a man after God’s own heart. He was anointed by Samuel while still a shepherd, defeated Goliath, and united the kingdom.',
      'He established Jerusalem as the capital and desired to build the temple. Despite his sins, he repented; the Messiah is promised as the Son of David.',
    ],
  },
  {
    id: 'solomon',
    name: 'Solomon',
    reference: { bookId: '1KI', chapter: 3, verse: 12 },
    content: [
      'Solomon was David’s son and king of Israel. He asked God for wisdom and was granted it along with wealth and peace. He built the temple in Jerusalem.',
      'He is known for the wisdom literature (Proverbs, Ecclesiastes, Song of Solomon). In his later years he turned to foreign wives and idolatry, leading to the kingdom’s division.',
    ],
  },
  {
    id: 'elijah',
    name: 'Elijah',
    reference: { bookId: '1KI', chapter: 18, verse: 36 },
    content: [
      'Elijah was a prophet during the reign of Ahab. He confronted the prophets of Baal on Mount Carmel and called down fire from heaven. He was fed by ravens and by a widow at Zarephath.',
      'He was taken up to heaven in a whirlwind (2 Kings 2). He appears with Moses at the Transfiguration of Jesus.',
    ],
  },
  {
    id: 'daniel',
    name: 'Daniel',
    reference: { bookId: 'DAN', chapter: 1, verse: 8 },
    content: [
      'Daniel was taken to Babylon as a youth and served in the courts of Nebuchadnezzar and later kings. He remained faithful to God, refusing to defile himself with the king’s food.',
      'He interpreted dreams and received visions of future kingdoms. He was saved from the lions’ den and is a model of integrity and prayer in exile.',
    ],
  },
  {
    id: 'esther',
    name: 'Esther',
    reference: { bookId: 'EST', chapter: 4, verse: 14 },
    content: [
      'Esther was a Jewish queen of Persia who risked her life to save her people from Haman’s plot. She was encouraged by Mordecai: “Who knows whether you have not come to the kingdom for such a time as this?”',
      'Her story is read at the feast of Purim. She is an example of courage and God’s providence behind the scenes.',
    ],
  },
  {
    id: 'ruth',
    name: 'Ruth',
    reference: { bookId: 'RUT', chapter: 1, verse: 16 },
    content: [
      'Ruth was a Moabite woman who chose to follow Naomi and the God of Israel. Her words “Your people shall be my people, and your God my God” are a classic confession of faith.',
      'She married Boaz and became an ancestor of David and thus of Christ. The book of Ruth illustrates loyalty, redemption, and God’s care for the foreigner.',
    ],
  },
  {
    id: 'mary-mother-of-jesus',
    name: 'Mary (mother of Jesus)',
    reference: { bookId: 'LUK', chapter: 1, verse: 30 },
    content: [
      'Mary was chosen to be the mother of Jesus. The angel Gabriel announced that she would conceive by the Holy Spirit. She responded in faith: “Behold, I am the servant of the Lord.”',
      'She appears at key moments in Jesus’ life: the birth, the visit to the temple, the wedding at Cana, and at the cross. She is honored in Christian tradition as theotokos (God-bearer).',
    ],
  },
  {
    id: 'jesus',
    name: 'Jesus',
    reference: { bookId: 'MAT', chapter: 3, verse: 17 },
    content: [
      'Jesus Christ is the Son of God and the center of Scripture. He was born in Bethlehem, ministered in Galilee and Judea, taught with authority, performed signs and wonders, and was crucified and raised from the dead.',
      'The Gospels present him as Messiah, Lord, and Savior. His death and resurrection are the basis of the Christian faith; he will return in glory to judge and to reign.',
    ],
  },
  {
    id: 'peter',
    name: 'Peter',
    reference: { bookId: 'MAT', chapter: 16, verse: 16 },
    content: [
      'Peter (Simon) was one of the twelve apostles and a leader of the early church. He confessed Jesus as the Christ and received the keys of the kingdom. He denied Jesus three times but was restored after the resurrection.',
      'He preached at Pentecost and opened the door of faith to Gentiles (Cornelius). Tradition holds that he was martyred in Rome. Two epistles in the New Testament bear his name.',
    ],
  },
  {
    id: 'paul',
    name: 'Paul',
    reference: { bookId: 'ACT', chapter: 9, verse: 15 },
    content: [
      'Paul (Saul of Tarsus) was a Pharisee who persecuted the church until he met the risen Christ on the road to Damascus. He became the apostle to the Gentiles and planted churches across the Roman world.',
      'He wrote many of the New Testament letters (Romans, Corinthians, Galatians, Ephesians, etc.) and taught that salvation is by grace through faith in Christ. He was imprisoned and martyred for the gospel.',
    ],
  },
  {
    id: 'john-the-apostle',
    name: 'John (apostle)',
    reference: { bookId: 'JHN', chapter: 13, verse: 23 },
    content: [
      'John was one of the twelve apostles, the “disciple whom Jesus loved.” He was present at the Last Supper, the cross (where Jesus entrusted Mary to him), and the empty tomb.',
      'He wrote the Gospel of John, the letters 1–3 John, and Revelation. His writings emphasize love, truth, and the divinity of Christ.',
    ],
  },
  {
    id: 'stephen',
    name: 'Stephen',
    reference: { bookId: 'ACT', chapter: 7, verse: 55 },
    content: [
      'Stephen was one of the seven chosen to serve the early church. He was full of faith and the Holy Spirit and did great wonders. He was falsely accused and tried before the Sanhedrin.',
      'His speech in Acts 7 recounts Israel’s history and accuses the leaders of resisting the Spirit. He was stoned and became the first Christian martyr; Saul (Paul) was present at his death.',
    ],
  },
  {
    id: 'noah',
    name: 'Noah',
    reference: { bookId: 'GEN', chapter: 6, verse: 9 },
    content: [
      'Noah was a righteous man who walked with God in a corrupt generation. God instructed him to build an ark to save his family and pairs of animals from the flood.',
      'After the flood, God made a covenant with Noah and set the rainbow as a sign. Noah is cited in the New Testament as an example of faith and as a type of salvation through judgment.',
    ],
  },
  {
    id: 'joseph-son-of-jacob',
    name: 'Joseph (son of Jacob)',
    reference: { bookId: 'GEN', chapter: 37, verse: 3 },
    content: [
      'Joseph was sold by his brothers into Egypt but rose to become Pharaoh’s chief official. He interpreted dreams and stored grain for the famine, eventually saving his family and Egypt.',
      'He forgave his brothers and said, “You meant evil against me, but God meant it for good.” His story illustrates God’s providence and the fulfillment of God’s promises to Abraham.',
    ],
  },
  {
    id: 'samuel',
    name: 'Samuel',
    reference: { bookId: '1SA', chapter: 3, verse: 10 },
    content: [
      'Samuel was a prophet and the last judge of Israel. He was dedicated to the Lord by his mother Hannah and heard God’s call as a boy in the tabernacle at Shiloh.',
      'He anointed Saul and later David as king. He is remembered for the word “Speak, Lord, for your servant hears” and for his integrity as a leader.',
    ],
  },
  {
    id: 'isaiah',
    name: 'Isaiah',
    reference: { bookId: 'ISA', chapter: 6, verse: 8 },
    content: [
      'Isaiah prophesied in Judah during the reigns of Uzziah, Jotham, Ahaz, and Hezekiah. He saw the Lord in the temple and responded, “Here I am; send me.”',
      'His book contains messianic prophecies (e.g. the suffering servant, Immanuel) and calls for justice and trust in God. He is often quoted in the New Testament.',
    ],
  },
  {
    id: 'jeremiah',
    name: 'Jeremiah',
    reference: { bookId: 'JER', chapter: 1, verse: 5 },
    content: [
      'Jeremiah was called to prophesy before he was born. He ministered in Judah in the years leading to the Babylonian exile and was opposed and persecuted for his message.',
      'He warned of judgment and the fall of Jerusalem but also promised a new covenant (Jeremiah 31). He is known as the “weeping prophet” for his grief over his people’s sin.',
    ],
  },
  // —— From early Genesis ——
  {
    id: 'adam',
    name: 'Adam',
    reference: { bookId: 'GEN', chapter: 2, verse: 7 },
    content: [
      'Adam was the first man, created by God from the dust of the ground. God placed him in the garden of Eden to work and keep it and gave him Eve as a helper.',
      'He fell by disobeying God’s command not to eat from the tree of the knowledge of good and evil. Through Adam sin and death entered the world; Christ is called the last Adam who brings life.',
    ],
  },
  {
    id: 'eve',
    name: 'Eve',
    reference: { bookId: 'GEN', chapter: 2, verse: 22 },
    content: [
      'Eve was the first woman, formed by God from Adam’s side. She was named “mother of all living” after the fall.',
      'She was deceived by the serpent and ate the forbidden fruit and gave some to Adam. Despite the curse, the promise of a redeemer (the seed of the woman) was given.',
    ],
  },
  {
    id: 'cain',
    name: 'Cain',
    reference: { bookId: 'GEN', chapter: 4, verse: 1 },
    content: [
      'Cain was the firstborn son of Adam and Eve. He brought an offering that God did not accept, then in jealousy killed his brother Abel.',
      'God marked him and he went away from the Lord’s presence to the land of Nod. He is a warning against unrighteous anger and the way of sin.',
    ],
  },
  {
    id: 'abel',
    name: 'Abel',
    reference: { bookId: 'GEN', chapter: 4, verse: 4 },
    content: [
      'Abel was the second son of Adam and Eve. He kept sheep and offered a sacrifice that God accepted (by faith, Hebrews 11:4).',
      'He was murdered by his brother Cain. Jesus and the New Testament speak of “the blood of Abel” and of Abel as the first martyr.',
    ],
  },
  {
    id: 'job',
    name: 'Job',
    reference: { bookId: 'JOB', chapter: 1, verse: 1 },
    content: [
      'Job was a blameless and upright man who feared God. He was tested when Satan was allowed to afflict him with loss, disease, and the accusations of friends.',
      'He questioned God but did not curse him. In the end the Lord answered him and restored his fortunes. The book of Job explores suffering, wisdom, and God’s sovereignty.',
    ],
  },
  {
    id: 'sarah',
    name: 'Sarah',
    reference: { bookId: 'GEN', chapter: 17, verse: 15 },
    content: [
      'Sarah was the wife of Abraham and mother of Isaac. She was barren until God promised a son in old age; she laughed but later bore Isaac as God had said.',
      'She is remembered for her faith (Hebrews 11:11) and for sending away Hagar and Ishmael. She is an ancestor of Christ and an example of God’s covenant faithfulness.',
    ],
  },
  {
    id: 'isaac',
    name: 'Isaac',
    reference: { bookId: 'GEN', chapter: 22, verse: 2 },
    content: [
      'Isaac was the son of Abraham and Sarah, the child of promise. He was nearly offered as a sacrifice on Mount Moriah, but God provided a ram instead.',
      'He married Rebekah and was the father of Jacob and Esau. He is a type of Christ (the beloved son offered) and the covenant continued through him.',
    ],
  },
  {
    id: 'jacob',
    name: 'Jacob',
    reference: { bookId: 'GEN', chapter: 28, verse: 12 },
    content: [
      'Jacob was the son of Isaac and Rebekah, and the father of the twelve tribes of Israel. He received the blessing (though by deceit) and wrestled with God at Peniel.',
      'He was renamed Israel. His sons became the patriarchs; he went down to Egypt to join Joseph and died there, looking forward to the promised land.',
    ],
  },
  {
    id: 'esau',
    name: 'Esau',
    reference: { bookId: 'GEN', chapter: 25, verse: 24 },
    content: [
      'Esau was the twin brother of Jacob, the firstborn of Isaac. He sold his birthright for a meal and lost his father’s blessing to Jacob.',
      'He is called Edom and became the ancestor of the Edomites. He is held up in Hebrews as a warning: a profane person who valued the temporary over the eternal.',
    ],
  },
  {
    id: 'miriam',
    name: 'Miriam',
    reference: { bookId: 'EXO', chapter: 15, verse: 20 },
    content: [
      'Miriam was the sister of Moses and Aaron. As a girl she watched over the baby Moses in the bulrushes; later she led the women in song after the crossing of the Red Sea.',
      'She was struck with leprosy when she and Aaron opposed Moses, but was restored after Moses interceded. She is remembered as a prophetess and a leader in Israel.',
    ],
  },
  {
    id: 'joshua',
    name: 'Joshua',
    reference: { bookId: 'JOS', chapter: 1, verse: 1 },
    content: [
      'Joshua was the successor of Moses who led Israel into the Promised Land. He was one of the twelve spies who urged the people to trust God; only he and Caleb entered Canaan.',
      'He conquered Jericho and the land, divided the territory among the tribes, and charged Israel to serve the Lord. His name means “the Lord saves”; he is a type of Christ.',
    ],
  },
  {
    id: 'deborah',
    name: 'Deborah',
    reference: { bookId: 'JDG', chapter: 4, verse: 4 },
    content: [
      'Deborah was a prophetess and judge of Israel. She sat under a palm tree and the people came to her for judgment; she summoned Barak to lead the army against Sisera.',
      'She went with Barak and gave the signal for battle; with Jael’s help the enemy was defeated. Her song in Judges 5 celebrates God’s deliverance and is a classic of Hebrew poetry.',
    ],
  },
  {
    id: 'barak',
    name: 'Barak',
    reference: { bookId: 'JDG', chapter: 4, verse: 6 },
    content: [
      'Barak was an Israelite commander summoned by the prophetess Deborah to fight Sisera and the Canaanites. He agreed to go only if Deborah went with him.',
      'God gave Israel the victory; Sisera fled and was killed by Jael. Hebrews 11:32 names Barak among those who through faith conquered kingdoms.',
    ],
  },
  {
    id: 'gideon',
    name: 'Gideon',
    reference: { bookId: 'JDG', chapter: 6, verse: 12 },
    content: [
      'Gideon was called by the angel of the Lord to deliver Israel from Midian. He asked for signs (the fleece) and with 300 men defeated the Midianite army.',
      'He refused to be king, saying “The Lord will rule over you.” He is listed in Hebrews 11 among the heroes of faith, though his later years were marred by an idol.',
    ],
  },
  {
    id: 'naomi',
    name: 'Naomi',
    reference: { bookId: 'RUT', chapter: 1, verse: 2 },
    content: [
      'Naomi was the wife of Elimelech; she went to Moab in a famine and lost her husband and sons. She returned to Bethlehem with Ruth and urged the women to call her “Mara” (bitter).',
      'She guided Ruth to Boaz; when Obed was born the women said a son had been born to Naomi. She is a picture of God’s restoration and the place of the Gentile in the lineage of Christ.',
    ],
  },
  {
    id: 'boaz',
    name: 'Boaz',
    reference: { bookId: 'RUT', chapter: 2, verse: 1 },
    content: [
      'Boaz was a kinsman of Naomi and a man of standing in Bethlehem. He showed kindness to Ruth, allowed her to glean in his field, and acted as redeemer to marry her.',
      'He and Ruth became the parents of Obed, the grandfather of David. He is a type of Christ the redeemer and illustrates the law of the kinsman-redeemer.',
    ],
  },
  {
    id: 'saul-king',
    name: 'Saul (king)',
    reference: { bookId: '1SA', chapter: 10, verse: 1 },
    content: [
      'Saul was the first king of Israel, anointed by Samuel. He was tall and impressive but disobeyed God by offering sacrifice and by sparing Agag and the Amalekite spoil.',
      'God rejected him as king and chose David. He grew jealous of David and pursued him; he died in battle on Mount Gilboa. His reign marks the transition from judges to the monarchy.',
    ],
  },
  {
    id: 'elisha',
    name: 'Elisha',
    reference: { bookId: '2KI', chapter: 2, verse: 9 },
    content: [
      'Elisha was the successor of Elijah; he asked for a double portion of Elijah’s spirit and received it when Elijah was taken up in the chariot of fire.',
      'He performed many miracles: healing Naaman, multiplying oil and food, raising the Shunammite’s son. He served as prophet in Israel for decades and anointed Jehu and Hazael.',
    ],
  },
  {
    id: 'jonah',
    name: 'Jonah',
    reference: { bookId: 'JON', chapter: 1, verse: 1 },
    content: [
      'Jonah was a prophet sent to preach against Nineveh. He fled by ship, was thrown into the sea, and was swallowed by a great fish; after three days he was delivered and obeyed.',
      'Nineveh repented, but Jonah was angry that God showed mercy. The book illustrates God’s compassion for the nations and the resurrection (Jesus compared his three days to Jonah’s sign).',
    ],
  },
  {
    id: 'ezekiel',
    name: 'Ezekiel',
    reference: { bookId: 'EZK', chapter: 1, verse: 1 },
    content: [
      'Ezekiel was a priest and prophet among the exiles in Babylon. He saw dramatic visions of God’s glory, the valley of dry bones, and the new temple.',
      'He acted out parables (e.g. lying on his side, cutting his hair) and warned of judgment and restoration. His message brought hope that God would restore Israel and give a new heart.',
    ],
  },
  // —— New Testament ——
  {
    id: 'joseph-husband-of-mary',
    name: 'Joseph (husband of Mary)',
    reference: { bookId: 'MAT', chapter: 1, verse: 20 },
    content: [
      'Joseph was the earthly father of Jesus, a descendant of David and a craftsman. He was betrothed to Mary when an angel told him in a dream that her child was from the Holy Spirit.',
      'He took Mary as his wife, protected the child in Egypt, and raised him in Nazareth. He is last mentioned when Jesus was twelve in the temple; his absence later suggests he may have died before Jesus’ ministry.',
    ],
  },
  {
    id: 'john-the-baptist',
    name: 'John the Baptist',
    reference: { bookId: 'MAT', chapter: 3, verse: 1 },
    content: [
      'John the Baptist was the forerunner of Jesus, of priestly descent. He preached in the wilderness, baptized for repentance, and called the religious leaders a brood of vipers.',
      'He baptized Jesus and said, “Behold, the Lamb of God.” He was imprisoned by Herod and beheaded. Jesus said that among those born of women none was greater than John.',
    ],
  },
  {
    id: 'james-son-of-zebedee',
    name: 'James (son of Zebedee)',
    reference: { bookId: 'MAT', chapter: 10, verse: 2 },
    content: [
      'James was one of the twelve apostles, the son of Zebedee and brother of John. He was with Jesus at the Transfiguration and in Gethsemane.',
      'Herod Agrippa had him put to death by the sword; he is the only apostle whose martyrdom is recorded in the New Testament. He is often called James the Greater.',
    ],
  },
  {
    id: 'andrew',
    name: 'Andrew',
    reference: { bookId: 'JHN', chapter: 1, verse: 40 },
    content: [
      'Andrew was Simon Peter’s brother and one of the twelve apostles. He was a disciple of John the Baptist and brought Peter to Jesus; he also brought the boy with the loaves and fish.',
      'He was from Bethsaida and worked as a fisherman. Tradition holds that he was martyred by crucifixion in Patras. He is known for bringing others to Christ.',
    ],
  },
  {
    id: 'thomas',
    name: 'Thomas',
    reference: { bookId: 'JHN', chapter: 11, verse: 16 },
    content: [
      'Thomas (called Didymus) was one of the twelve. He said, “Let us also go, that we may die with him,” when Jesus went to Lazarus; after the resurrection he doubted until he saw Jesus’ wounds.',
      'Jesus said, “Blessed are those who have not seen and yet have believed.” Tradition holds that Thomas preached as far as India and was martyred there. He is often called “Doubting Thomas.”',
    ],
  },
  {
    id: 'matthew',
    name: 'Matthew',
    reference: { bookId: 'MAT', chapter: 9, verse: 9 },
    content: [
      'Matthew (Levi) was a tax collector whom Jesus called to follow him. He left his booth and became one of the twelve apostles.',
      'He is traditionally identified as the author of the Gospel of Matthew. As a tax collector he would have been literate and familiar with records—fitting for a Gospel that emphasizes fulfillment and kingdom.',
    ],
  },
  {
    id: 'barnabas',
    name: 'Barnabas',
    reference: { bookId: 'ACT', chapter: 4, verse: 36 },
    content: [
      'Barnabas was a Levite from Cyprus; his name means “son of encouragement.” He sold land and gave the proceeds to the church and introduced Saul (Paul) to the apostles.',
      'He accompanied Paul on the first missionary journey and was with him at the Jerusalem council. He and Paul later parted over John Mark, but Barnabas continued to encourage believers.',
    ],
  },
  {
    id: 'nicodemus',
    name: 'Nicodemus',
    reference: { bookId: 'JHN', chapter: 3, verse: 1 },
    content: [
      'Nicodemus was a Pharisee and ruler of the Jews who came to Jesus by night. Jesus told him that one must be born again to see the kingdom of God.',
      'He later spoke up for Jesus in the Sanhedrin and helped Joseph of Arimathea bury Jesus, bringing myrrh and aloes. He is an example of a secret disciple whose faith grew slowly.',
    ],
  },
  {
    id: 'lazarus',
    name: 'Lazarus',
    reference: { bookId: 'JHN', chapter: 11, verse: 1 },
    content: [
      'Lazarus was the brother of Mary and Martha of Bethany, a friend of Jesus. When he fell ill and died, Jesus came and raised him from the dead after four days in the tomb.',
      'This sign led many to believe but also prompted the chief priests to plot against both Jesus and Lazarus. He is a vivid example of Jesus’ power over death and the hope of resurrection.',
    ],
  },
  {
    id: 'martha',
    name: 'Martha',
    reference: { bookId: 'LUK', chapter: 10, verse: 38 },
    content: [
      'Martha was the sister of Mary and Lazarus; she welcomed Jesus into her home. She was busy with serving and asked Jesus to tell Mary to help; Jesus said Mary had chosen the good portion.',
      'When Lazarus died she went out to meet Jesus and confessed, “I believe that you are the Christ, the Son of God.” She is remembered for her service and her growing faith.',
    ],
  },
  {
    id: 'mary-magdalene',
    name: 'Mary Magdalene',
    reference: { bookId: 'JHN', chapter: 20, verse: 1 },
    content: [
      'Mary Magdalene was one of the women who followed Jesus; he had cast seven demons from her. She was at the cross and went early to the tomb on the first day of the week.',
      'She was the first to see the risen Jesus and was sent to tell the disciples. She is a key witness to the resurrection and an example of devoted discipleship.',
    ],
  },
  {
    id: 'luke',
    name: 'Luke',
    reference: { bookId: 'COL', chapter: 4, verse: 14 },
    content: [
      'Luke was a Gentile, a physician, and a close companion of Paul. He wrote the Gospel of Luke and the Acts of the Apostles, presenting an orderly account of Jesus’ life and the early church.',
      'He was with Paul on missionary journeys and during his imprisonment. His writings emphasize salvation for all nations, the work of the Spirit, and the role of women and the poor.',
    ],
  },
  {
    id: 'mark',
    name: 'Mark',
    reference: { bookId: 'ACT', chapter: 12, verse: 12 },
    content: [
      'Mark (John Mark) was the son of Mary, in whose house the church gathered; he was a cousin of Barnabas. He accompanied Paul and Barnabas on part of their first journey but left them.',
      'Later he was valued by Paul and by Peter, who called him “my son.” Tradition holds that he wrote the Gospel of Mark, drawing on Peter’s preaching. He is a model of restoration after failure.',
    ],
  },
  {
    id: 'timothy',
    name: 'Timothy',
    reference: { bookId: 'ACT', chapter: 16, verse: 1 },
    content: [
      'Timothy was a young believer from Lystra, the son of a Jewish mother and Greek father. Paul took him as a fellow worker and sent him on missions to churches.',
      'Paul wrote two letters to him about pastoral ministry, calling him “my true child in the faith.” He was to guard the deposit, preach the word, and set an example in life and doctrine.',
    ],
  },
  {
    id: 'titus',
    name: 'Titus',
    reference: { bookId: 'TIT', chapter: 1, verse: 4 },
    content: [
      'Titus was a Gentile companion of Paul, trusted with difficult tasks. Paul sent him to Corinth to address the collection and disorder and later left him in Crete to appoint elders.',
      'Paul’s letter to Titus instructs him to teach sound doctrine and to train believers in good works. He is a model of a reliable minister and church planter.',
    ],
  },
]
