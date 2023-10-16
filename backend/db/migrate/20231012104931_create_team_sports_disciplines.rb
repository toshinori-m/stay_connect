class CreateTeamSportsDisciplines < ActiveRecord::Migration[7.0]
  def change
    create_table :team_sports_disciplines do |t|
      t.references :sports_discipline, foreign_key: true
      t.references :team, foreign_key: true

      t.timestamps
    end
  end
end
