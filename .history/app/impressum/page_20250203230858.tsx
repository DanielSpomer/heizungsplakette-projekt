import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function Impressum() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <Link href="/">
            <Image src="/images/heizungsplakette-logo.png" alt="Heizungsplakette Logo" width={250} height={50} />
          </Link>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">IMPRESSUM</h1>
        
        <div className="space-y-6 text-gray-600">
          <section>
            <h2 className="text-xl font-semibold mb-2 text-gray-700">Verantwortlich:</h2>
            <p>Andrea Johns</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2 text-gray-700">Kontakt:</h2>
            <p>Johns Datenschutz GmbH</p>
            <p>GFin: Andrea Johns,</p>
            <p>An der Kolonnade 11, 10117 Berlin,</p>
            <p>service@heizungsplakette.de,</p>
            <p>030 – 20630794</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2 text-gray-700">Registereintrag:</h2>
            <p>AG Berlin Charlottenburg HRB 197324 B</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2 text-gray-700">Aufsichtsbehörde:</h2>
            <p>Gewerbeaufsichtsamt Berlin</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2 text-gray-700">Rechtsberatung:</h2>
            <p>Die Rechtsberatung außerhalb des Datenschutzes erfolgt durch Rechtsanwalt Sven Johns, MOSLER+PARTNERRECHTSANWÄLTE München/Berlin, Pariser Platz 4a, 10117 Berlin.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2 text-gray-700">Streitschlichtung</h2>
            <h3 className="text-lg font-semibold mb-1 text-gray-700">Verbraucherinformation</h3>
            <p>Online-Streitbeilegung gem. Art. 14 Abs. 1 ODR-VO: Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit, die Sie hier finden:</p>
            <p><a href="https://ec.europa.eu/consumers/odr" className="text-blue-600 hover:underline">https://ec.europa.eu/consumers/odr</a></p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2 text-gray-700">Weitere Informationen</h2>
            <h3 className="text-lg font-semibold mb-1 text-gray-700">Externe Links</h3>
            <p>Wir sind als Diensteanbieter nach § 2 Nr. 1 Telemediengesetz (TMG) für die &quot;eigenen Inhalte&quot; und zur Nutzung bereitgehaltene Inhalte nach den allgemeinen Gesetzen verantwortlich. Von diesen eigenen Inhalten sind Querverweise (sog. &quot;Links&quot;) auf die von anderen Anbietern bereitgehaltenen Inhalte zu unterscheiden. Durch den Querverweis halten wir insoweit auch &quot;fremde Inhalte&quot; zur Nutzung bereit.</p>
            <p>Johns Datenschutz UG macht sich diese fremden Seiteninhalte nicht zu Eigen. Sie hat keinen Einfluss auf die fremden Seiteninhalte, übernimmt dafür keinerlei Verantwortung und distanziert sich ausdrücklich davon.</p>
            <p>Für diese fremden Inhalte sind wir nur dann verantwortlich, wenn wir von ihnen (d. h. auch von einem rechtswidrigen bzw. strafbaren Inhalt) positive Kenntnis haben und es uns technisch möglich und zumutbar ist, deren Nutzung zu verhindern. Bei &quot;Links&quot; handelt es sich allerdings stets um &quot;lebende&quot; (dynamische) Verweisungen. Wir haben bei der erstmaligen Verknüpfung zwar den fremden Inhalt daraufhin überprüft, ob durch ihn eine mögliche zivilrechtliche oder strafrechtliche Verantwortlichkeit ausgelöst wird. Wir sind aber nicht dazu verpflichtet, die Inhalte, auf die in seinem Angebot verwiesen wird, ständig auf Veränderungen zu überprüfen, die eine Verantwortlichkeit neu begründen könnten. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.</p>
            <p>Wir sind nicht verantwortlich und können deshalb keinerlei Gewähr für die Einhaltung von Datenschutzbestimmungen bei jenen Websites leisten, auf welche unsere Gesellschaft durch einen Link oder auf andere Weise verweist.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2 text-gray-700">Urheberrecht</h2>
            <p>Inhalt und Struktur der Website der Johns Datenschutz GmbH sind urheberrechtlich geschützt. Die Vervielfältigung von Informationen oder Daten, insbesondere die Verwendung von Texten, Textteilen oder Bildmaterial bedarf unserer vorherigen Zustimmung. Kopien und Downloads von Websites unseres Internetangebotes dürfen ohne schriftliche Genehmigung nur für den persönlichen, privaten und nicht kommerziellen Gebrauch hergestellt werden.</p>
            <p>Sofern die Inhalte dieser Website nicht von uns erstellt wurde, werden diese als Inhalt von Dritten gekennzeichnet und die Urheberrechte gegenüber dem Dritten gewahrt. Bitte informieren Sie uns umgehend, wenn Sie auf eine Urheberrechtsverletzung aufmerksam werden sollten. Zu einer Mitteilung nutzen Sie bitte die im Impressum angegebenen Kontaktdaten. Bei Bekanntwerden von Rechtsverstößen werden derartige Inhalte von uns umgehend entfernt.</p>
            <p>Bei Fragen zur Erhebung, Verarbeitung oder Nutzung Ihrer personenbezogenen Daten, bei Auskünften, Berichtigung, Sperrung oder Löschung von Daten sowie Widerruf erteilter Einwilligungen oder wenn Sie zu einem Punkt nähere Informationen wünschen, wenden Sie sich bitte an die im Impressum angegebenen Kontaktdaten.</p>
          </section>
        </div>
      </main>
      <footer className="bg-[#28299F] text-white py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <p>&copy; 2025 Heizungsplakette.de | Alle Rechte vorbehalten.</p>
          <div>
          <Link href="/impressum" className="mr-4 hover:underline">Impressum</Link>
          <Link href="/datenschutzerklaerung" className="hover:underline">Datenschutzerklärung</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}