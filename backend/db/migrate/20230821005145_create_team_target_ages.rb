class CreateTeamTargetAges < ActiveRecord::Migration[7.0]
  def change
    create_table :team_target_ages do |t|
      ## User Info
      t.references :target_age
      t.references :team
      t.timestamps
    end
  end
end
