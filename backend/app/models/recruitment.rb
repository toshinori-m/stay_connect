class Recruitment < ApplicationRecord
  belongs_to :sports_type
  belongs_to :user
  belongs_to :prefecture

  has_many :recruitment_target_ages, dependent: :destroy
  has_many :target_ages,  through: :appointments

  validates :name, presence: true
  validates :area, presence: true
  enum sex: { man: 0, woman: 1, mix: 2 }, _prefix: true
  validates :sex, presence: true
  validates :number, presence: true, numericality: { greater_than: 0 }
  validate :date_before_start
  validates :end_date, comparison: { greater_than: :start_date }, presence: true
  validates :purpose_body, presence: true

  require 'date'
  
  def date_before_start
    return if start_date.blank?
    errors.add(:start_date, "今日以降の日付を選択してください") if start_date < Date.today
  end
end
