import { useEffect, useState, ChangeEvent, useActionState } from "react"
import { useNavigate } from "react-router-dom"
import { useApiClient } from "@/hooks/useApiClient"
import { useAuth } from "@/context/useAuthContext"
import InputField from "@/components/ui/InputField"
import TextareaField from "@/components/ui/TextareaField"
import RadioGroupField from "@/components/ui/RadioGroupField"
import CheckboxField from "@/components/ui/CheckboxField"
import Button from "@/components/ui/Button"
import ErrorDisplay from "@/components/ui/ErrorDisplay"
import { z, ZodIssue } from "zod"

interface User {
  id?: number
  name: string
  email: string
  birthday: string
  sex: string
  self_introduction: string
  image_url?: string
  email_notification: "receives" | "not_receive"
}

interface FormState {
  user: User
  imageFile: File | null
  error: string | null
}

export default function BasicSettingEditPage() {
  const SHOW_LIMIT_THRESHOLD = 5
  const NAME_MIN_LENGTH = 2
  const NAME_MAX_LENGTH = 100
  const SELF_INTRODUCTION_MIN_LENGTH = 1
  const MAX_LENGTH = 255
  const remainingNameCharacters = (input: string | null) => NAME_MAX_LENGTH - (input?.length ?? 0)
  const remainingCharacters = (input: string | null) => MAX_LENGTH - (input?.length ?? 0)

  const USER_FIELDS = {
    NAME: "name",
    EMAIL: "email",
    BIRTHDAY: "birthday",
    SEX: "sex",
    SELF_INTRODUCTION: "self_introduction",
    EMAIL_NOTIFICATION: "email_notification",
    IMAGE: "image"
  }

  const navigate = useNavigate()
  const apiClient = useApiClient()
  const { user } = useAuth()
  const userId = user?.uid ?? null

  const [fetchedId, setFetchedId] = useState<string | null>(null)
  const [errors, setErrors] = useState<string[]>([])
  const [formState, setFormState] = useState<FormState>({
    user: {
      name: "",
      email: "",
      birthday: "",
      sex: "man",
      self_introduction: "",
      email_notification: "receives"
    },
    imageFile: null,
    error: null
  })

  const [actionState, action, isPending] = useActionState(
    async () => {
      
      try {
        // バリデーション
        const userSchema = z.object({
          name: z.string()
            .min(NAME_MIN_LENGTH, `ユーザー名を${NAME_MIN_LENGTH}文字以上で入力してください。`)
            .max(NAME_MAX_LENGTH, `ユーザー名を${NAME_MAX_LENGTH}文字以内で入力してください。`),
          email: z.string()
            .nonempty("メールアドレスを入力してください。")
            .email("正しいメールアドレスを入力してください。"),
          sex: z.string().nonempty("性別を選択してください。"),
          birthday: z.string()
            .nonempty("誕生日を入力してください。")
            .refine(
              (val: string) => {
                const today = new Date()
                today.setHours(0, 0, 0, 0)
                const selectedDate = new Date(val)
                return selectedDate <= today
              },
              { message: "誕生日は今日以前の日付を選択してください。" }
            ),
          self_introduction: z.string()
            .min(SELF_INTRODUCTION_MIN_LENGTH, `自己紹介を${SELF_INTRODUCTION_MIN_LENGTH}文字以上で入力してください。`)
            .max(MAX_LENGTH, `自己紹介を${MAX_LENGTH}文字以内で入力してください。`),
          id: z.number().optional()
        })

        // バリデーション実行
        userSchema.parse(formState.user)

        // エラーがなければフォームデータ作成
        const formData = new FormData()
        formData.append(`user[${USER_FIELDS.NAME}]`, formState.user.name)
        formData.append(`user[${USER_FIELDS.EMAIL}]`, formState.user.email)
        formData.append(`user[${USER_FIELDS.BIRTHDAY}]`, formState.user.birthday)
        formData.append(`user[${USER_FIELDS.SEX}]`, formState.user.sex)
        formData.append(`user[${USER_FIELDS.SELF_INTRODUCTION}]`, formState.user.self_introduction)
        formData.append(`user[${USER_FIELDS.EMAIL_NOTIFICATION}]`, formState.user.email_notification)

        if (formState.imageFile) {
          formData.append(`user[${USER_FIELDS.IMAGE}]`, formState.imageFile)
        }

        // APIリクエスト
        await apiClient.patch(`/users/${formState.user.id}`, formData)
        navigate("/home")
        return { errors: [] }
        
      } catch (error) {
        if (error instanceof z.ZodError) {
          // Zodバリデーションエラーを設定
          const newErrors = error.errors.map((err: ZodIssue) => err.message)
          return { errors: newErrors }
        } else {
          // その他のエラーを設定
          return { errors: ["基本設定に誤りがあります。"] }
        }
      }
    },
    { errors: [] }
  )

  useEffect(() => {
    if (fetchedId === userId) return

    if (!userId) {
      navigate("/login")
      return
    }

    fetchUserBasicSettings(userId)
      .then(userSettingData => {
        if (!userSettingData) return
        setErrors([])
        setFetchedId(userId)
      })
      .catch(() => {
        setErrors(["基本設定を表示できませんでした。"])
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId])
  
  const fetchUserBasicSettings = async (userId: string) => {
    const userSettingData = (await apiClient.get(`/users/${userId}`)).data.data
    setFormState(prev => ({
      ...prev,
      user: {
        ...userSettingData,
        name: userSettingData.name ?? "",
        email: userSettingData.email ?? "",
        birthday: userSettingData.birthday ?? "",
        sex: userSettingData.sex ?? "man",
        self_introduction: userSettingData.self_introduction ?? "",
        email_notification: userSettingData.email_notification ?? "receives",
        image_url: userSettingData.image_url ?? ""
      },
      error: null
    }))
    return userSettingData
  }

  const setImage = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && files[0]) {
      const file = files[0]
      setFormState(prev => ({
        ...prev,
        imageFile: file
      }))
      
      const reader = new FileReader()
      reader.onload = (e) => {
        setFormState(prev => ({
          ...prev,
          user: {
            ...prev.user,
            image_url: e.target?.result as string
          }
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const toggleEmailNotification = (event: ChangeEvent<HTMLInputElement>) => {
    setFormState(prev => ({
      ...prev,
      user: {
        ...prev.user,
        email_notification: event.target.checked ? "receives" : "not_receive"
      }
    }))
  }
  
  const redirectToSendEmail = () => {
    navigate("/send-email")
  }

  const isEmailNotificationEnabled = () => {
    return formState.user.email_notification === "receives"
  }  

  const getEmailNotificationLabel = () => {
    return isEmailNotificationEnabled() ? "受信する" : "受信しない"
  }

  const updateFormState = (field: string, value: unknown) => {
    setFormState(prev => ({
      ...prev,
      user: {
        ...prev.user,
        [field]: value
      }
    }))
  }

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    updateFormState(field, e.target.value)
  }

  const handleSexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFormState((USER_FIELDS.SEX), e.target.value)
  }

  return (
    <div className="flex items-center justify-center mt-32 md:mt-20">
      <div className="w-full md:w-3/5 xl:w-2/5 shadow-gray-200 bg-sky-100 rounded-lg">
        <h2 className="text-center mb-10 pt-10 font-bold text-3xl text-blue-600">基本設定編集</h2>
        <form className="px-4 md:px-0 text-center" action={action}>
          <ul className="space-y-4 text-left">
            {/* 名前 */}
            <li className="md:grid md:grid-cols-12 md:gap-4 md:items-center">
              <div className="md:col-span-12 md:ml-2 md:mr-4">
                <InputField
                  name={USER_FIELDS.NAME}
                  type="text"
                  title="名前"
                  placeholder="名前"
                  value={formState.user.name}
                  onChange={handleInputChange(USER_FIELDS.NAME)}
                />
              </div>
            </li>
            {remainingNameCharacters(formState.user.name) <= SHOW_LIMIT_THRESHOLD && (
              <div className="text-red-500 text-sm">名前はあと{remainingNameCharacters(formState.user.name)}文字までです。</div>
            )}

            {/* アイコン */}
            <li className="md:grid md:grid-cols-12 md:gap-4 md:items-center">
              <div className="md:col-span-12 md:ml-2 md:mr-4">
                <InputField
                  name={USER_FIELDS.IMAGE}
                  type="file"
                  title="アイコン"
                  onChange={setImage}
                />
              </div>
            </li>
            {formState.user.image_url && (
              <img 
                className="mx-auto w-72 text-gray-400" 
                src={formState.user.image_url} 
                alt="アイコン" 
              />
            )}

            {/* 誕生日 */}
            <li className="md:grid md:grid-cols-12 md:gap-4 md:items-center">
              <div className="md:col-span-12 md:ml-2 md:mr-4">
                <InputField
                  name={USER_FIELDS.BIRTHDAY}
                  type="date"
                  title="誕生日"
                  placeholder="誕生日"
                  value={formState.user.birthday}
                  onChange={handleInputChange(USER_FIELDS.BIRTHDAY)}
                />
              </div>
            </li>

            {/* 性別 */}
            <li className="md:grid md:grid-cols-12 md:gap-4 md:items-center">
              <div className="md:col-span-12 md:ml-2 md:mr-4">
                <RadioGroupField
                  name={USER_FIELDS.SEX}
                  title="性別"
                  options={[
                    { title: "男", value: "man" },
                    { title: "女", value: "woman" }
                  ]}
                  selected={formState.user.sex}
                  onChange={handleSexChange}
                />
              </div>
            </li>

            {/* メールアドレス */}
            <li className="md:grid md:grid-cols-12 md:gap-4 md:items-center">
              <div className="md:col-span-12 md:ml-2 md:mr-4">
                <InputField
                  name={USER_FIELDS.EMAIL}
                  type={USER_FIELDS.EMAIL}
                  title="メールアドレス"
                  placeholder="メールアドレス"
                  value={formState.user.email}
                  onChange={handleInputChange(USER_FIELDS.EMAIL)}
                />
              </div>
            </li>

            {/* パスワード */}
            <li className="md:grid md:grid-cols-12 md:gap-4 md:items-center">
              <div className="w-full flex md:px-8 items-center md:col-span-12 md:ml-2 md:mr-4">
                <label className="w-40 md:-ml-3 pl-2 tracking-tighter text-sm">パスワード</label>
                <div className="w-full my-2">
                  <Button variant="yellow" size="sm" type="button" onClick={redirectToSendEmail}>
                    （変更する）
                  </Button>
                </div>
              </div>
            </li>

            {/* 自己紹介 */}
            <li className="md:grid md:grid-cols-12 md:gap-4 md:items-center">
              <div className="md:col-span-12 md:ml-2 md:mr-4">
                <TextareaField
                  name={USER_FIELDS.SELF_INTRODUCTION}
                  title="自己紹介"
                  placeholder="自己紹介"
                  value={formState.user.self_introduction}
                  onChange={handleInputChange(USER_FIELDS.SELF_INTRODUCTION)}
                  rows={5}
                />
              </div>
            </li>
            {remainingCharacters(formState.user.self_introduction) <= SHOW_LIMIT_THRESHOLD && (
              <div className="text-red-500 text-sm">自己紹介はあと{remainingCharacters(formState.user.self_introduction)}文字までです。</div>
            )}

            {/* メール通知 */}
            <li className="md:grid md:grid-cols-12 md:gap-4 md:items-center">
              <div className="md:col-span-12 md:ml-2 md:mr-4">
                <CheckboxField
                  name={USER_FIELDS.EMAIL_NOTIFICATION}
                  title="メール通知"
                  statusText={getEmailNotificationLabel()}
                  checked={isEmailNotificationEnabled()}
                  onChange={toggleEmailNotification}
                />
              </div>
            </li>
          </ul>
          <ErrorDisplay
            errors={[...(formState.error ? [formState.error] : []), ...errors, ...actionState.errors]}
          />
          <div className="text-center my-5">
            <Button type="submit" variant="primary" size="sm" className="mr-4" disabled={isPending}>
              {isPending ? "更新中..." : "更新"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
