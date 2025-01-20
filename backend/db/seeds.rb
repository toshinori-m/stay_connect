errors = []

# 都道府県名リスト
prefecture_names = %w[
  北海道 青森県 岩手県 宮城県 秋田県 山形県 福島県 茨城県 栃木県 群馬県 埼玉県 千葉県 東京都 神奈川県
  新潟県 富山県 石川県 福井県 山梨県 長野県 岐阜県 静岡県 愛知県 三重県 滋賀県 京都府 大阪府 兵庫県 奈良県 和歌山県
  鳥取県 島根県 岡山県 広島県 山口県 徳島県 香川県 愛媛県 高知県 福岡県 佐賀県 長崎県 熊本県 大分県 宮崎県 鹿児島県 沖縄県
]

# 都道府県の登録
prefecture_names.each do |name|
  Prefecture.find_or_create_by!(name: name)
end

# 競技名の登録
sports_types = [
  { name: '陸上短距離走' },
  { name: '陸上中距離走' },
  { name: '陸上長距離走' },
  { name: 'バスケットボール' },
  { name: 'ハンドボール' },
  { name: '野球' }
]

sports_types.each do |sports_type|
  SportsType.find_or_create_by!(sports_type)
end

# 種目名の登録
sports_disciplines = [
  # 陸上短距離走の種目
  { name: '100m', sports_type_name: '陸上短距離走' },
  { name: '200m', sports_type_name: '陸上短距離走' },
  { name: '400m', sports_type_name: '陸上短距離走' },

  # 陸上中距離走の種目
  { name: '800m', sports_type_name: '陸上中距離走' },
  { name: '1500m', sports_type_name: '陸上中距離走' },
  { name: '3000m', sports_type_name: '陸上中距離走' },

  # 陸上長距離走の種目
  { name: '5000m', sports_type_name: '陸上長距離走' },
  { name: '10000m', sports_type_name: '陸上長距離走' },

  # 他の競技の種目
  { name: '3x3バスケットボール', sports_type_name: 'バスケットボール' }
]

sports_disciplines.each do |discipline|
  begin
    sports_type = SportsType.find_by!(name: discipline[:sports_type_name])

    SportsDiscipline.find_or_create_by!(name: discipline[:name], sports_type_id: sports_type.id)
  rescue ActiveRecord::RecordNotFound => e
    errors << { type: 'RecordNotFound', message: e.message, related_data: discipline }
  rescue ActiveRecord::RecordInvalid => e
    errors << { type: 'RecordInvalid', message: e.record.errors.full_messages, related_data: discipline }
  end
end

# 対象年齢の登録
target_ages = %w[成人 大学生 高校生 中学生 小学生高学年 小学生低学年]
target_ages.each do |age|
  TargetAge.find_or_create_by!(name: age)
end

errors.each do |error|
  puts "Error Type: #{error[:type]}, Message: #{error[:message]}, Data: #{error[:related_data]}"
end
