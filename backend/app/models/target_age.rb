class TargetAge < ApplicationRecord
  has_many :recruitment_target_ages, dependent: :destroy
  has_many :recruitments, through: :recruitment_target_ages

  has_many :team_target_ages, dependent: :destroy
  has_many :teams, through: :team_target_ages
  
  validates :name, presence: true
end
