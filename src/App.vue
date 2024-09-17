<template>
  <div class="w-full max-w-md px-2 py-8 sm:px-0">
    <TabGroup>
      <TabList class="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
        <Tab v-for="title in titles" :key="title" v-slot="{ selected }" as="template">
          <button
            :class="[
              'w-full rounded-lg py-2.5 text-base font-medium leading-5',
              'ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
              selected
                ? 'bg-white text-blue-700 shadow'
                : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
            ]"
          >
            {{ title }}
          </button>
        </Tab>
      </TabList>

      <TabPanels class="mt-8">
        <TabPanel class="space-y-4">
          <SettingsView />
        </TabPanel>

        <TabPanel>
          <Suspense>
            <CurCourseView />
            <template v-slot:fallback>
              <div class="snow-card">
                <div class="text-center text-gray-700 text-2xl font-light">Loading...</div>
              </div>
            </template>
          </Suspense>
        </TabPanel>

        <TabPanel>
          <Suspense>
            <AllCoursesView />
            <template v-slot:fallback>
              <div class="snow-card">
                <div class="text-center text-gray-700 text-2xl font-light">Loading...</div>
              </div>
            </template>
          </Suspense>
        </TabPanel>
      </TabPanels>
    </TabGroup>
  </div>
</template>

<script setup>
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/vue';
import SettingsView from '@/components/SettingsView.vue';
import AllCoursesView from '@/components/AllCoursesView.vue';
import CurCourseView from '@/components/CurCoursesView.vue';

const titles = ['置设', '近期排课', '全部排课'];
</script>
