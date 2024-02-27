# frozen_string_literal: true

class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  # devise :database_authenticatable, :registerable, 
  #        :recoverable, :rememberable, :validatable, password_length: 2..128
  # include DeviseTokenAuth::Concerns::User
  include Rails.application.routes.url_helpers

  has_many :teams
  has_many :recruitments
  has_many :chat_messages

  has_many :chat_room_users, dependent: :destroy
  has_many :chat_rooms,  through: :chat_room_users

  validate :validate_name_length
  enum sex: { man: 0, woman: 1 }
  validates :email, presence: true, format: { with: /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i }
  validates :email, uniqueness: true
  enum email_notification: { receives: true, not_receive: false }
  validates :email_notification, presence: true
  has_one_attached :image
  
  def image_url
    image.attached? ? url_for(image) : nil
  end

  def chat_rooms_with_other_users
    chat_rooms.eager_load(chat_room_users: :user).map do |room|
      other_user = room.other_user(user_id: id)
      {
        chat_room: room,
        other_user_name: other_user&.name,
        other_user_id: other_user&.id
      }
    end
  end

  private

  def validate_name_length
    if name.blank?
      errors.add(:name, 'nameを入力してください。')
    elsif name.length < 2
      errors.add(:name, 'nameは最小は2文字必要です')
    elsif name.length > 100
      errors.add(:name, 'nameは最大100文字です')
    end
  end
end
