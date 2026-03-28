import { MousePointer2, Redo2, Undo2 } from 'lucide-react'

export function CanvasToolbar() {
  return (
    <div className='absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-lg border'>
      <button type='button' className='p-2 hover:bg-gray-100 rounded' title='Select/Move'>
        <MousePointer2 className='w-5 h-5' />
      </button>
      <div className='w-px h-6 bg-gray-200' />
      <button type='button' className='p-2 hover:bg-gray-100 rounded' title='Undo'>
        <Undo2 className='w-5 h-5' />
      </button>
      <button type='button' className='p-2 hover:bg-gray-100 rounded' title='Redo'>
        <Redo2 className='w-5 h-5' />
      </button>
    </div>
  )
}
