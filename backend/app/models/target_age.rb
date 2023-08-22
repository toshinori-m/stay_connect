class TargetAge < ApplicationRecord
  has_many :team_target_ages
  has_many :recruitment_target_ages
  
  validates :name, presence: true
end
