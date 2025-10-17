import { MapPin } from 'lucide-react'

const stats = [
  {
    icon: MapPin,
    value: '308',
    label: 'Concelhos Cobertos',
    description: 'Em Portugal Continental e Ilhas'
  }
]

export default function Stats() {
  return (
    <section className="py-16 bg-primary-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon
            return (
              <div key={index} className="text-center">
                <div className="inline-flex p-4 bg-white/10 rounded-full mb-4">
                  <IconComponent className="w-8 h-8" />
                </div>
                <div className="text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-lg font-semibold mb-1">{stat.label}</div>
                <div className="text-primary-100 text-sm">{stat.description}</div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
