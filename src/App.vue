<template>
  <div class="w-full max-w-md px-2 py-8 sm:px-0">
    <TabGroup>
      <TabList class="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
        <Tab
          v-for="title in titles"
          as="template"
          :key="title"
          v-slot="{ selected }"
        >
          <button
            :class="[
              'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
              'ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
              selected
                ? 'bg-white text-blue-700 shadow'
                : 'text-blue-100 hover:bg-white/[0.12] hover:text-white',
            ]"
          >
            {{ title }}
          </button>
        </Tab>
      </TabList>

      <TabPanels class="mt-8">
        <TabPanel
          :class="[
            'rounded-xl bg-white p-3',
            'ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
          ]"
        >
          <ul>
            <li class="relative rounded-md p-3 hover:bg-gray-100"
                v-for="post in messages"
                :key="post.id"
            >

              <h3 class="text-sm font-medium leading-5">{{ post.title }}</h3>

              <ul class="mt-1 flex space-x-1 text-xs font-normal leading-4 text-gray-500">
                <li>{{ post.date }}</li>
                <li>&middot;</li>
                <li>{{ post.commentCount }} comments</li>
                <li>&middot;</li>
                <li>{{ post.shareCount }} shares</li>
              </ul>

              <a href="#"
                 :class="[
                  'absolute inset-0 rounded-md',
                  'ring-blue-400 focus:z-10 focus:outline-none focus:ring-2',
                ]"
              />

            </li>
          </ul>
        </TabPanel>

        <TabPanel>
          <h1>WTF2</h1>
        </TabPanel>

        <TabPanel>
          <h1>WTF3</h1>
        </TabPanel>
      </TabPanels>
    </TabGroup>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from '@headlessui/vue'

const titles = ['置设', '课程', 'Debug']

const messages = ref([
  {
    id: 1,
    title: 'Does drinking coffee make you smarter?',
    date: '5h ago',
    commentCount: 5,
    shareCount: 2
  },
  {
    id: 2,
    title: 'So you\'ve bought coffee... now what?',
    date: '2h ago',
    commentCount: 3,
    shareCount: 2
  }
])
</script>