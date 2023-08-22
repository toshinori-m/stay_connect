class TargetAge < ApplicationRecord
  has_many :team_target_age
  has_many :recruitment_target_age
  
  validates :name, presence: true
end
