import { Check, ChevronsUpDown, X } from 'lucide-react'
import { useRef, useState } from 'react'
import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/shared/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover'

interface TagInputProps {
  value: string[]
  onChange: (value: string[]) => void
  options?: string[]
  placeholder?: string
}

export function TagInput({
  value,
  onChange,
  options = [],
  placeholder = '选择或输入标签...',
}: TagInputProps) {
  const [open, setOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSelect = (tag: string) => {
    if (value.includes(tag)) {
      onChange(value.filter(t => t !== tag))
    } else {
      onChange([...value, tag])
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault()
      const newTag = inputValue.trim()
      if (!value.includes(newTag)) {
        onChange([...value, newTag])
      }
      setInputValue('')
    }
  }

  const handleRemove = (tag: string) => {
    onChange(value.filter(t => t !== tag))
  }

  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(inputValue.toLowerCase())
  )

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className='w-full h-auto min-h-[40px] justify-between bg-gray-800 border-gray-700 text-white hover:bg-gray-800'
        >
          <div className='flex flex-wrap gap-1 flex-1'>
            {value.length === 0 ? (
              <span className='text-gray-500'>{placeholder}</span>
            ) : (
              value.map(tag => (
                <Badge
                  key={tag}
                  className='bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
                  onClick={e => {
                    e.stopPropagation()
                    handleRemove(tag)
                  }}
                >
                  {tag}
                  <X className='ml-1 h-3 w-3 cursor-pointer' />
                </Badge>
              ))
            )}
          </div>
          <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className='w-[--radix-popover-trigger-width] p-0 bg-gray-900 border-gray-700'
        align='start'
      >
        <Command className='bg-transparent'>
          <div className='flex items-center border-b border-gray-700 px-3'>
            <input
              ref={inputRef}
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder='输入后按 Enter 创建...'
              className='flex-1 h-10 bg-transparent text-white placeholder:text-gray-500 outline-none text-sm'
            />
          </div>
          <CommandList>
            <CommandEmpty className='py-2 px-3 text-sm text-gray-500'>
              {inputValue.trim() ? `按 Enter 创建 "${inputValue.trim()}"` : '暂无预设标签'}
            </CommandEmpty>
            <CommandGroup>
              {filteredOptions.map(option => (
                <CommandItem
                  key={option}
                  value={option}
                  onSelect={() => handleSelect(option)}
                  className='text-white hover:bg-gray-800 cursor-pointer'
                >
                  <Check
                    className={`mr-2 h-4 w-4 ${value.includes(option) ? 'opacity-100' : 'opacity-0'}`}
                  />
                  {option}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
