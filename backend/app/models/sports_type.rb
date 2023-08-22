class SportsType < ApplicationRecord
  belongs_to :team
  belongs_to :recruitment

  validates :name, presence: true, length: { minimum: 2 }
end
