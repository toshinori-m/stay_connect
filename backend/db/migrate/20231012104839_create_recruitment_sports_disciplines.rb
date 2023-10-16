class CreateRecruitmentSportsDisciplines < ActiveRecord::Migration[7.0]
  def change
    create_table :recruitment_sports_disciplines do |t|
      t.references :recruitment, foreign_key: true
      t.references :sports_discipline, foreign_key: true

      t.timestamps
    end
  end
end
