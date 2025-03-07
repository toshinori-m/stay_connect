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

ActiveRecord::Schema[7.0].define(version: 2024_02_15_085828) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "active_storage_attachments", force: :cascade do |t|
    t.string "name", null: false
    t.string "record_type", null: false
    t.bigint "record_id", null: false
    t.bigint "blob_id", null: false
    t.datetime "created_at", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", force: :cascade do |t|
    t.string "key", null: false
    t.string "filename", null: false
    t.string "content_type"
    t.text "metadata"
    t.string "service_name", null: false
    t.bigint "byte_size", null: false
    t.string "checksum"
    t.datetime "created_at", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "active_storage_variant_records", force: :cascade do |t|
    t.bigint "blob_id", null: false
    t.string "variation_digest", null: false
    t.index ["blob_id", "variation_digest"], name: "index_active_storage_variant_records_uniqueness", unique: true
  end

  create_table "chat_messages", force: :cascade do |t|
    t.bigint "user_id"
    t.bigint "chat_room_id"
    t.string "message"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.boolean "read", default: false, null: false
    t.index ["chat_room_id"], name: "index_chat_messages_on_chat_room_id"
    t.index ["user_id"], name: "index_chat_messages_on_user_id"
  end

  create_table "chat_room_users", force: :cascade do |t|
    t.bigint "user_id"
    t.bigint "chat_room_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "chat_count", default: 0
    t.index ["chat_room_id"], name: "index_chat_room_users_on_chat_room_id"
    t.index ["user_id"], name: "index_chat_room_users_on_user_id"
  end

  create_table "chat_rooms", force: :cascade do |t|
    t.boolean "paid_or_free", default: false, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "prefectures", force: :cascade do |t|
    t.string "name", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "recruitment_sports_disciplines", force: :cascade do |t|
    t.bigint "recruitment_id"
    t.bigint "sports_discipline_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["recruitment_id"], name: "index_recruitment_sports_disciplines_on_recruitment_id"
    t.index ["sports_discipline_id"], name: "index_recruitment_sports_disciplines_on_sports_discipline_id"
  end

  create_table "recruitment_target_ages", force: :cascade do |t|
    t.bigint "target_age_id"
    t.bigint "recruitment_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["recruitment_id"], name: "index_recruitment_target_ages_on_recruitment_id"
    t.index ["target_age_id"], name: "index_recruitment_target_ages_on_target_age_id"
  end

  create_table "recruitments", force: :cascade do |t|
    t.string "name", null: false
    t.string "area", null: false
    t.integer "sex", default: 0, null: false
    t.integer "number", null: false
    t.date "start_date", null: false
    t.date "end_date", null: false
    t.text "purpose_body", null: false
    t.bigint "user_id", null: false
    t.bigint "sports_type_id", null: false
    t.string "image"
    t.text "other_body"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "prefecture_id", null: false
    t.index ["prefecture_id"], name: "index_recruitments_on_prefecture_id"
    t.index ["sports_type_id"], name: "index_recruitments_on_sports_type_id"
    t.index ["user_id"], name: "index_recruitments_on_user_id"
  end

  create_table "sports_disciplines", force: :cascade do |t|
    t.bigint "sports_type_id"
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["sports_type_id"], name: "index_sports_disciplines_on_sports_type_id"
  end

  create_table "sports_types", force: :cascade do |t|
    t.string "name", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "target_ages", force: :cascade do |t|
    t.string "name", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "team_sports_disciplines", force: :cascade do |t|
    t.bigint "sports_discipline_id"
    t.bigint "team_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["sports_discipline_id"], name: "index_team_sports_disciplines_on_sports_discipline_id"
    t.index ["team_id"], name: "index_team_sports_disciplines_on_team_id"
  end

  create_table "team_target_ages", force: :cascade do |t|
    t.bigint "target_age_id"
    t.bigint "team_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["target_age_id"], name: "index_team_target_ages_on_target_age_id"
    t.index ["team_id"], name: "index_team_target_ages_on_team_id"
  end

  create_table "teams", force: :cascade do |t|
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

  create_table "users", force: :cascade do |t|
    t.string "provider"
    t.string "uid", default: "", null: false
    t.string "name", null: false
    t.string "email", null: false
    t.boolean "email_notification", default: true, null: false
    t.string "encrypted_password"
    t.string "image"
    t.date "birthday"
    t.integer "sex"
    t.text "self_introduction"
    t.text "tokens"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.boolean "allow_password_change"
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
    t.index ["uid", "provider"], name: "index_users_on_uid_and_provider", unique: true
  end

  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "active_storage_variant_records", "active_storage_blobs", column: "blob_id"
  add_foreign_key "recruitment_sports_disciplines", "recruitments"
  add_foreign_key "recruitment_sports_disciplines", "sports_disciplines"
  add_foreign_key "recruitments", "prefectures"
  add_foreign_key "team_sports_disciplines", "sports_disciplines"
  add_foreign_key "team_sports_disciplines", "teams"
end
