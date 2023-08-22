class Recruitment < ApplicationRecord
  belongs_to :sports_types
  belongs_to :user
  belongs_to :areas

  has_many :recruitment_target_age

  validates :name, presence: true
  validates :area, presence: true
  enum sex: { man: 0, woman: 1, mix: 2 }
  validates :sex, presence: true, numericality: { only_integer: true }
  validates :number, presence: true, numericality: { greater_than: 0 }
  validates :start_date, date: true
  validates :end_date, date: true
  validates :purpose_body, presence: true
end
