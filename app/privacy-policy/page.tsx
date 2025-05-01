import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, FileText, Shield } from "lucide-react"

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 via-green-50 to-yellow-100">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-6">
          <Link href="/">
            <Button variant="outline" className="border-green-200 text-green-700 flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" /> Повернутися на головну
            </Button>
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 border-2 border-green-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <FileText className="h-6 w-6 text-green-600" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-green-700">Політика конфіденційності</h1>
          </div>

          <div className="prose prose-green max-w-none">
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-5 w-5 text-green-600" />
                <h2 className="text-xl font-bold text-green-700">Загальні положення</h2>
              </div>
              <p className="text-green-600">
                Ця Політика конфіденційності визначає, як ми збираємо, використовуємо, зберігаємо та захищаємо
                інформацію, отриману від учасників конкурсу "Малюнок для мого Сміливовершника". Ми серйозно ставимося до
                захисту ваших персональних даних і дотримуємося всіх відповідних законів про захист даних.
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-bold text-green-700 mb-2">Які дані ми збираємо</h2>
              <p className="text-green-600 mb-4">Для участі в конкурсі ми збираємо наступну інформацію:</p>
              <ul className="list-disc pl-6 text-green-600 space-y-2">
                <li>Ім'я дитини</li>
                <li>Вік дитини</li>
                <li>Місто, де працює батько/мати</li>
                <li>Назва магазину або офісу</li>
                <li>Ім'я батька/матері</li>
                <li>Контактний телефон</li>
                <li>Малюнок, створений дитиною</li>
              </ul>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-bold text-green-700 mb-2">Як ми використовуємо ваші дані</h2>
              <p className="text-green-600 mb-4">Ми використовуємо зібрані дані для:</p>
              <ul className="list-disc pl-6 text-green-600 space-y-2">
                <li>Організації та проведення конкурсу "Малюнок для мого Сміливовершника"</li>
                <li>Зв'язку з учасниками конкурсу</li>
                <li>Публікації малюнків у галереї конкурсу (з вашої згоди)</li>
                <li>Визначення та оголошення переможців конкурсу</li>
                <li>
                  Використання малюнків для створення патріотичного контенту до Дня Захисника та Захисниці (з вашої
                  згоди)
                </li>
              </ul>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-bold text-green-700 mb-2">Згода на обробку даних</h2>
              <p className="text-green-600">
                Подаючи заявку на участь у конкурсі, ви даєте згоду на обробку ваших персональних даних відповідно до
                цієї Політики конфіденційності. Для дітей віком до 14 років згоду надають батьки або законні
                представники.
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-bold text-green-700 mb-2">Зберігання та захист даних</h2>
              <p className="text-green-600">
                Ми зберігаємо ваші дані лише протягом періоду, необхідного для проведення конкурсу та пов'язаних з ним
                заходів. Ми вживаємо всіх необхідних технічних та організаційних заходів для захисту ваших персональних
                даних від несанкціонованого доступу, втрати або пошкодження.
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-bold text-green-700 mb-2">Ваші права</h2>
              <p className="text-green-600 mb-4">Ви маєте право:</p>
              <ul className="list-disc pl-6 text-green-600 space-y-2">
                <li>Отримати доступ до ваших персональних даних</li>
                <li>Виправити неточні персональні дані</li>
                <li>Видалити ваші персональні дані</li>
                <li>Відкликати вашу згоду на обробку персональних даних</li>
                <li>Подати скаргу до відповідного органу з захисту даних</li>
              </ul>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-bold text-green-700 mb-2">Зміни до Політики конфіденційності</h2>
              <p className="text-green-600">
                Ми можемо оновлювати цю Політику конфіденційності час від часу. Будь-які зміни будуть опубліковані на
                цій сторінці.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-green-700 mb-2">Контактна інформація</h2>
              <p className="text-green-600">
                Якщо у вас є питання щодо цієї Політики конфіденційності або обробки ваших персональних даних, будь
                ласка, зв'яжіться з нами за адресою: privacy@yourcompany.com
              </p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-green-100 text-center">
            <p className="text-green-600">Останнє оновлення: {new Date().toLocaleDateString("uk-UA")}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
