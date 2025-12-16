import { useForm } from 'react-hook-form'
import ErrorMessage from '../components/ErrorMessage'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { checkHandleAvailability } from '../api/DevTreeApi'

type SearchFormData = { handle: string }

function makeSlug(value: string){
  return value.trim().toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,'').replace(/-+/g,'-')
}

export default function SearchForm(){
  const { register, handleSubmit, formState: { errors }, watch } = useForm<SearchFormData>({ defaultValues: { handle: '' } })
  const [loading, setLoading] = useState(false)
  const [available, setAvailable] = useState<boolean | null>(null)
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

  const onSubmit = async (data: SearchFormData) => {
    const slug = makeSlug(data.handle)
    if(!slug) return

    setLoading(true)
    setAvailable(null)
    setMessage('')
    try {
      const res = await checkHandleAvailability(slug)
      if(res.available){
        setAvailable(true)
        setMessage(`El handle "${slug}" está disponible.`)
        // te llevo al registro con el handle en query param
        // o podrías crear directamente el perfil — según requerimiento del profe: "Llenar el handle desde el home"
        navigate(`/auth/register?handle=${encodeURIComponent(slug)}`)
      } else {
        setAvailable(false)
        setMessage(`El handle "${slug}" ya está tomado.`)
        // sugerencia: llevar al perfil público
        // navigate(`/${slug}`)
      }
    } catch (err: any) {
      setMessage(err.message || 'Error')
    } finally {
      setLoading(false)
    }
  }

  const current = watch('handle')

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="relative flex items-center bg-white px-2 rounded-md border border-slate-200">
        <label htmlFor="handle" className="text-slate-600 pr-2">devtree.com/</label>
        <input
          id="handle"
          type="text"
          className="border-none bg-transparent p-2 focus:ring-0 flex-1"
          placeholder="elonmusk, zuck, jeffbezos"
          {...register('handle', { required: 'Un Nombre de Usuario es obligatorio' })}
        />
      </div>

      {errors.handle && <ErrorMessage>{errors.handle.message}</ErrorMessage>}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          className="bg-cyan-400 p-3 text-lg w-full uppercase text-slate-600 rounded-lg font-bold cursor-pointer hover:bg-cyan-500 transition-colors"
          disabled={loading}
        >
          {loading ? 'Comprobando...' : 'Obtener mi DevTree'}
        </button>
      </div>

      {message && (
        <p className={`mt-2 ${available ? 'text-green-500' : 'text-red-400'}`}>
          {message}
        </p>
      )}
    </form>
  )
}