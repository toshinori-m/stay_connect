class TargetAge < ApplicationRecord
  has_many :recruitment_target_ages, dependent: :destroy
  has_many :recruitments, through: :appointments

  has_many :team_target_ages, dependent: :destroy
  has_many :teams, through: :appointments
  
  validates :name, presence: true
end
