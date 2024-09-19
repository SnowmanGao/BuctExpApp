<template>
  <Combobox ref="cbRef" v-model="selected" nullable>
    <div class="relative z-10 mb-2">
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
          ref="inputRef"
          :displayValue="(person) => (person as IPersonOrNull)?.sid ?? ''"
          class="w-full py-2 pl-3 pr-10 text-base leading-5 text-gray-900"
          placeholder="请输入学号..."
          type="search"
          @change="onInputChange()"
          @focusin="hasFocus = true"
          @focusout="onInputBlur()"
          @keydown="onInputKeyDown($event)"
        />
        <ComboboxButton class="absolute inset-y-0 right-0 flex items-center pr-2">
          <ChevronUpDownIcon aria-hidden="true" class="h-5 w-5 text-gray-400" />
        </ComboboxButton>
      </div>
      <TransitionRoot
        leave="transition ease-in duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <ComboboxOptions
          :class="hasNotFound && hasFocus ? 'bg-red-50' : 'bg-green-50'"
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
            @click="onSelectedPerson()"
          >
            <li
              :class="{
                'bg-teal-600': selected,
                'bg-teal-600/10': active && !selected
              }"
              class="relative cursor-default select-none py-2 pl-10 pr-4"
            >
              <span class="truncate flex">
                <span :class="selected ? 'text-white' : 'text-grey-900'">
                  {{ person.sid }}
                </span>
                <span
                  :class="selected ? 'text-slate-200' : 'text-gray-400'"
                  class="ml-2 text-sm leading-[1.5rem]"
                >
                  @{{ person.class }}
                </span>
              </span>

              <span
                v-if="selected"
                :class="selected ? 'text-white' : 'text-teal-600'"
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
import { computed, type ComputedRef, onMounted, type Ref, ref } from 'vue';
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  TransitionRoot
} from '@headlessui/vue';
import { CheckIcon, ChevronUpDownIcon, ExclamationCircleIcon } from '@heroicons/vue/20/solid';
import { curStudentId, studentDict } from '@/core/MainSystem';
import { arrayTake, debounce, scrollToBottom, scrollToTop } from '@/core/Utils';
import { StorageSystem } from '@/core/StorageSystem';
import SnowTag from '@/components/SnowTag.vue';
import { waitForStudentDataAsync } from '@/core/FetchSystem';

interface IPerson {
  sid: string;
  class: string;
}

type IPersonOrNull = IPerson | null;

// Vue Event
onMounted(async () => {
  // 为 InputElement 的简写赋值
  inputElement = inputRef.value.$el;
  // 网络请求 StudentData
  await waitForStudentDataAsync();
  // 尝试从 localStorage 加载学号
  curStudentId.value = StorageSystem.loadSid();
  const sid = curStudentId.value;
  if (sid !== null) {
    inputElement.value = sid;
    query.value = sid;
  }
  // 挂载 HeadlessUI Hacking
  ComboboxHack.init();
  ComboboxHack.beforeOpen(() => {
    return inputElement.value != '' || filteredPeople.value.length != 0;
  });
});

// My Event: Option.OnClick & Input.OnPress(Enter) & Input.OnFocusOut
const onSelectedPerson = debounce(() => {
  // 必须保证 selected 不为空！
  inputElement.blur();
  scrollToTop();
  curStudentId.value = selected.value!.sid ?? null;
  StorageSystem.saveSid(curStudentId.value);
}, 500);

function clearCurStudent() {
  ComboboxHack.close();
  curStudentId.value = null;
  selected.value = null;
  StorageSystem.saveSid(null);
}

// My Event : Input.OnChange
function onInputChange() {
  const input = inputElement;
  query.value = input.value;
  if (input.value == '') clearCurStudent();
  else scrollToBottom();
}

// My Event : Input.OnKeyDown
function onInputKeyDown(e: KeyboardEvent) {
  if (e.key == 'Enter') onSelectedPerson();
}

// My Event : Input.OnFocusOut
function onInputBlur() {
  if (filteredPeople.value.length == 1) {
    selected.value = filteredPeople.value[0];
    onSelectedPerson();
  }
  if (ComboboxHack.isOpen()) hasFocus.value = false;
  if (inputElement.value == '') clearCurStudent();
}

// 当前选中的人，用 IPerson 表示
const selected: Ref<IPersonOrNull> = ref(null);
// 用户实际输入的内容（单向绑定输入框内容）
const query = ref('');
// 输入框的 HTMLElement Ref
const inputRef = ref();
// Combobox 的 HTMLElement Ref
const cbRef = ref();

// 简写，获取输入框的 HTMLElement 对象
let inputElement: HTMLInputElement;

// Hacking class for HeadlessUI
class ComboboxHack {
  static cb$: any;
  static provides: any;
  static stateRef: Ref<number>;

  static init() {
    this.cb$ = cbRef.value.$;
    this.provides = this.cb$.provides[Object.getOwnPropertySymbols(this.cb$.provides)[0]];
    this.stateRef = this.provides.comboboxState;
  }

  static close() {
    this.provides.closeCombobox();
  }

  static beforeOpen(fn: () => boolean) {
    const before = this.provides.openCombobox;
    this.provides.openCombobox = () => {
      if (!fn()) return;
      before();
    };
  }

  static isOpen(): boolean {
    return this.stateRef.value == 1;
  }
}

// 焦点是否在输入框（单向绑定输入框焦点）
const hasFocus = ref(false);
// 是否查无此人，用于控制输入框 border 颜色和选项背景颜色
const hasNotFound = computed(() => filteredPeople.value.length == 0);
// 获取颜色映射
const colorClassMap = computed(() => {
  if (hasFocus.value) {
    if (filteredPeople.value.length == 0 && query.value.length != 0) {
      return 'border-red-600';
    }
    return 'border-teal-600';
  }
  return 'border-grey-600';
});

// 将所有学生数据转化为便于展示的形态
const people: ComputedRef<IPerson[]> = computed(() => {
  return Object.entries(studentDict.value).map(([sid, data]) => ({
    sid: sid,
    class: data.class
  }));
});

// 获取当前所有的可选项
const filteredPeople = computed(() => {
  if (query.value == '') return [];
  return arrayTake(people.value, (p) => p.sid.includes(query.value.trim()), 5);
});
</script>

<style scoped>
#cb-input:focus {
  outline: none;
}

#cb-input-box {
  border-top-left-radius: 0;
  transition: border-color ease-in 0.1s;
}
</style>
