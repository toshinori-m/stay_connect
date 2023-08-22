class SportsType < ApplicationRecord
  has_one :recruitment
  has_one :team

  validates :name, presence: true, length: { minimum: 2 }
end
