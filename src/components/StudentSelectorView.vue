<template>
  <Combobox v-model="selected" nullable>
    <div id="otto-box" class="relative z-10">
      <SnowTag v-model="colorClassMap">学号</SnowTag>
      <div
        id="cb-input-box"
        :class="[
           colorClassMap,
          'relative cursor-default overflow-hidden rounded-lg bg-white text-left border-solid border-2'
        ]"
      >
        <ComboboxInput
          id="cb-input"
          ref="input"
          :displayValue="person => (person as IPersonOrNull)?.sid ?? ''"
          class="w-full py-2 pl-3 pr-10 text-base leading-5 text-gray-900"
          placeholder="请输入学号..."
          @change="query = $event.target.value"
          @focusin="hasFocus = true"
          @focusout="hasFocus = false"
        />
        <ComboboxButton class="absolute inset-y-0 right-0 flex items-center pr-2">
          <ChevronUpDownIcon aria-hidden="true" class="h-5 w-5 text-gray-400" />
        </ComboboxButton>
      </div>
      <TransitionRoot
        leave="transition ease-in duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        @after-leave="query = ''"
      >
        <ComboboxOptions
          :class="hasNotFound ? 'bg-red-50': 'bg-green-50'"
          class="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-green-50 py-1 text-base ring-1 ring-black/5 focus:outline-none"
        >
          <div
            v-if="filteredPeople.length == 0 && query != ''"
            class="relative cursor-default select-none px-4 py-2 text-gray-700"
          >
              <span class="flex">
                <ExclamationCircleIcon aria-hidden="true" class="h-6 w-6" />
                <span class="pl-2 font-bold">查无此人。</span>
              </span>
          </div>
          <ComboboxOption
            v-for="person in filteredPeople"
            :key="person.sid"
            v-slot="{ selected, active }"
            :value="person"
            as="template"
            @click="onSelectPerson(input.$el)"
          >
            <li
              :class="{'bg-teal-600': selected, 'bg-teal-600/10': active && !selected}"
              class="relative cursor-default select-none py-2 pl-10 pr-4"
            >

                <span class="truncate flex">
                  <span :class="selected ? 'text-white' : 'text-grey-900'">
                    {{ person.sid }}
                  </span>
                  <span :class="selected ? 'text-slate-200' : 'text-gray-400'"
                        class="ml-2 text-sm leading-[1.5rem]">
                    @{{ person.class }}
                  </span>
                </span>

              <span
                v-if="selected"
                :class="selected ? 'text-white': 'text-teal-600'"
                class="absolute inset-y-0 left-0 flex items-center pl-3"
              >
                  <CheckIcon aria-hidden="true" class="h-5 w-5" />
                </span>
            </li>
          </ComboboxOption>
        </ComboboxOptions>
      </TransitionRoot>
    </div>
  </Combobox>
</template>

<script lang="ts" setup>
import { computed, type ComputedRef, nextTick, onMounted, type Ref, ref } from 'vue'
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  TransitionRoot
} from '@headlessui/vue'
import { CheckIcon, ChevronUpDownIcon, ExclamationCircleIcon } from '@heroicons/vue/20/solid'
import type { RawStudent } from '@/core/MainModel'
import { curStudentId, isStudentLoaded, studentDict, transformStudent } from '@/core/MainSystem'
import { arrayTake } from '@/core/Utils'
import SnowTag from '@/components/SnowTag.vue'

interface IPerson {
  sid: string
  class: string
}

type IPersonOrNull = IPerson | null

// Vue Event
onMounted(() => {
  if (isStudentLoaded.value) return
  fetch('./src/assets/student_map.json')
    .then(response => response.json())
    .then((data: RawStudent) => transformStudent(data))
    .then(() => isStudentLoaded.value = true)
})

// Vue Event
onMounted(() => {
  const curStuId = curStudentId.value
  if (curStuId === null) return
  selected.value = {
    sid: curStuId,
    class: studentDict.value[curStuId].class
  }
})

// My Event
function onSelectPerson(el: HTMLElement) {
  nextTick(() => el.blur())
  curStudentId.value = selected.value?.sid ?? null
}

addEventListener('focusout', (e) =>
  onSelectPerson(e.target as HTMLElement))

// 当前选中的人，用 IPerson 表示
const selected: Ref<IPersonOrNull> = ref(null)

// 用户实际输入的内容
const query = ref('')
// 输入框 HTMLElement
const input = ref()

// 焦点是否在输入框，用于控制输入框 border 颜色
const hasFocus = ref(false)
// 是否查无此人，用于控制输入框 border 颜色和选项背景颜色
const hasNotFound = computed(() => hasFocus.value && filteredPeople.value.length == 0)
// 获取颜色映射
const colorClassMap = computed(() => {
  if (hasFocus.value) {
    if (filteredPeople.value.length == 0)
      return 'border-red-600'
    return 'border-teal-600'
  }
  return 'border-grey-600'
})

const people: ComputedRef<IPerson[]> =
  computed(() => {
    return Object
      .entries(studentDict.value)
      .map(([sid, data]) => ({
        sid: sid,
        class: data.class
      }))
  })

const filteredPeople = computed(() =>
  query.value == ''
    ? people.value.slice(0, 5)
    : arrayTake(people.value, (p) => p.sid.includes(query.value.trim()), 5)
)

</script>

<style scoped>
#cb-input:focus {
  outline: none;
}

#cb-input-box {
  border-top-left-radius: 0;
}

#otto-box {
  margin-bottom: 0.5rem;
}
</style>