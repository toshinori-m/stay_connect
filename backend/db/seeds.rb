# 都道府県名リスト
prefecture_names = %w[
  北海道 青森県 岩手県 宮城県 秋田県 山形県 福島県 茨城県 栃木県 群馬県 埼玉県 千葉県 東京都 神奈川県
  新潟県 富山県 石川県 福井県 山梨県 長野県 岐阜県 静岡県 愛知県 三重県 滋賀県 京都府 大阪府 兵庫県 奈良県 和歌山県
  鳥取県 島根県 岡山県 広島県 山口県 徳島県 香川県 愛媛県 高知県 福岡県 佐賀県 長崎県 熊本県 大分県 宮崎県 鹿児島県 沖縄県
]

# 都道府県の登録
prefecture_names.each do |name|
  Prefecture.create!(name: name)
end

# 競技名の登録
sports_types = SportsType.create([
  { name: '陸上短距離走' },
  { name: '陸上中距離走' },
  { name: '陸上長距離走' },
  { name: 'バスケットボール' },
  { name: '野球' }
])

# 種目名の登録
sports_disciplines = [
  # 陸上短距離走の種目
  { name: '100m', sports_type_id: sports_types.find { |st| st.name == '陸上短距離走' }.id },
  { name: '200m', sports_type_id: sports_types.find { |st| st.name == '陸上短距離走' }.id },
  { name: '400m', sports_type_id: sports_types.find { |st| st.name == '陸上短距離走' }.id },

  # 陸上中距離走の種目
  { name: '800m', sports_type_id: sports_types.find { |st| st.name == '陸上中距離走' }.id },
  { name: '1500m', sports_type_id: sports_types.find { |st| st.name == '陸上中距離走' }.id },
  { name: '3000m', sports_type_id: sports_types.find { |st| st.name == '陸上中距離走' }.id },

  # 陸上長距離走の種目
  { name: '5000m', sports_type_id: sports_types.find { |st| st.name == '陸上長距離走' }.id },
  { name: '10000m', sports_type_id: sports_types.find { |st| st.name == '陸上長距離走' }.id },

  # 他の競技の種目
  { name: '3x3バスケットボール', sports_type_id: sports_types.find { |st| st.name == 'バスケットボール' }.id }
]

SportsDiscipline.create!(sports_disciplines)

# 対象年齢の登録
TargetAge.create([{ name: '成人' }, { name: '大学生' }, { name: '高校生' }, { name: '中学生' }, { name: '小学生高学年' }, { name: '小学生低学年' }])
