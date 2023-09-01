# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.0].define(version: 2023_08_31_084240) do
  create_table "chat_messages", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.bigint "user_id"
    t.bigint "chat_room_id"
    t.string "message"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["chat_room_id"], name: "index_chat_messages_on_chat_room_id"
    t.index ["user_id"], name: "index_chat_messages_on_user_id"
  end

  create_table "chat_room_users", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.bigint "user_id"
    t.bigint "chat_room_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["chat_room_id"], name: "index_chat_room_users_on_chat_room_id"
    t.index ["user_id"], name: "index_chat_room_users_on_user_id"
  end

  create_table "chat_rooms", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.boolean "paid_or_free", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "prefectures", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "name", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "recruitment_target_ages", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.bigint "target_age_id"
    t.bigint "recruitment_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["recruitment_id"], name: "index_recruitment_target_ages_on_recruitment_id"
    t.index ["target_age_id"], name: "index_recruitment_target_ages_on_target_age_id"
  end

  create_table "recruitments", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "name", null: false
    t.string "area", null: false
    t.integer "sex", default: 0, null: false
    t.integer "number", null: false
    t.date "start_date", null: false
    t.date "end_date", null: false
    t.text "purpose_body", null: false
    t.bigint "user_id"
    t.bigint "sports_type_id"
    t.string "image"
    t.text "other_body"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "prefecture_id"
    t.index ["prefecture_id"], name: "index_recruitments_on_prefecture_id"
    t.index ["sports_type_id"], name: "index_recruitments_on_sports_type_id"
    t.index ["user_id"], name: "index_recruitments_on_user_id"
  end

  create_table "sports_types", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "name", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "target_ages", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "name", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "team_target_ages", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.bigint "target_age_id"
    t.bigint "team_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["target_age_id"], name: "index_team_target_ages_on_target_age_id"
    t.index ["team_id"], name: "index_team_target_ages_on_team_id"
  end

  create_table "teams", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "name", null: false
    t.string "area", null: false
    t.integer "sex", default: 0, null: false
    t.text "track_record", null: false
    t.bigint "user_id"
    t.bigint "sports_type_id"
    t.bigint "prefecture_id"
    t.text "other_body"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["prefecture_id"], name: "index_teams_on_prefecture_id"
    t.index ["sports_type_id"], name: "index_teams_on_sports_type_id"
    t.index ["user_id"], name: "index_teams_on_user_id"
  end

  create_table "users", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "provider", default: "email", null: false
    t.string "uid", default: "", null: false
    t.string "name", null: false
    t.string "email", null: false
    t.boolean "email_notification", default: true, null: false
    t.string "encrypted_password", default: "", null: false
    t.string "image"
    t.date "birthday"
    t.integer "sex"
    t.text "self_introduction"
    t.text "tokens"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["uid", "provider"], name: "index_users_on_uid_and_provider", unique: true
  end

  add_foreign_key "recruitments", "prefectures"
end
