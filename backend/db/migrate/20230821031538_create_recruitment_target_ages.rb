class CreateRecruitmentTargetAges < ActiveRecord::Migration[7.0]
  def change
    create_table :recruitment_target_ages do |t|
      ## User Info
      t.references :target_age
      t.references :recruitment
      t.timestamps
    end
  end
end
