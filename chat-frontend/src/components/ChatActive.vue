<template>
  <div
      v-if="conversationStore.inChatting === true"
      class="h-full flex flex-col"
  >
    <div
        class="flex flex-col sm:flex-row border-b border-slate-200/60 dark:border-darkmode-400 px-5 py-4"
    >
      <div class="flex items-center">
        <div class="w-10 h-10 sm:w-12 sm:h-12 flex-none image-fit relative">
          <img
              alt="Midone Tailwind HTML Admin Template"
              class="rounded-full"
              v-bind:src="receiver?.avatar"
          />
        </div>
        <div class="ml-3 mr-auto">
          <div class="font-medium text-base">
            {{ receiver?.username }}
          </div>
          <div class="text-slate-500 text-xs sm:text-sm">
            Hey, I am using chat <span class="mx-1">•</span> Online
          </div>
        </div>
      </div>
    </div>
    <div
        id="message-box"
        class="overflow-y-scroll px-5 pt-5 flex-1"
        @scroll="handleScroll"
    >
      <div v-for="(message, index) in messageList" :key="message._id">
        <div
            v-if="index === 0"
            class="text-slate-400 dark:text-slate-500 text-xs text-center mb-10 mt-5"
        >
          {{ message.dayCreated }}
        </div>
        <div
            v-if="
            index > 0 &&
            messageList[index].dayCreated !== messageList[index - 1].dayCreated
          "
            class="text-slate-400 dark:text-slate-500 text-xs text-center mb-10 mt-5"
        >
          {{ message.dayCreated }}
        </div>

        <div
            v-if="user._id !== message.sender"
            class="chat__box__text-box flex items-end float-left mb-4"
        >
          <div
              class="w-10 h-10 hidden sm:block flex-none image-fit relative mr-5"
          >
            <img
                alt="Midone Tailwind HTML Admin Template"
                class="rounded-full"
                v-bind:src="receiver?.avatar"
            />
          </div>
          <!-- Message text YOU-->
          <div
              v-if="
              !message.isFile &&
              !message.isImage &&
              !message.text.startsWith('http')
            "
              class="bg-slate-100 dark:bg-darkmode-400 px-4 py-3 text-slate-500 rounded-r-md rounded-t-md"
          >
            {{ addSpaceInMessageIfTooLong(message.text) }}
            <div class="mt-1 text-xs text-slate-500">
              {{ moment(message.createdAt).format("H:mm") }}
            </div>
          </div>
          <!-- Message Link thường YOU -->
          <div
              v-if="
              !message.isFile &&
              !message.isImage &&
              message.text.startsWith('http') &&
              !message.text.startsWith('https://www.youtube.com/')
            "
              class="bg-slate-100 dark:bg-darkmode-400 px-4 py-3 text-slate-500 rounded-r-md rounded-t-md hover:text-purple-500"
          >
            <a :href="message.text" target="_blank">
              {{ addSpaceInMessageIfTooLong(message.text) }}
            </a>
            <div class="mt-1 text-xs text-slate-500">
              {{ moment(message.createdAt).format("H:mm") }}
            </div>
          </div>
          <!-- Message youtube link YOU -->
          <div
              v-if="
              !message.isFile &&
              !message.isImage &&
              message.text.startsWith('https://www.youtube.com/') &&
              !message.text.includes('list')
            "
              class="bg-slate-100 dark:bg-darkmode-400 px-4 py-3 text-slate-500 rounded-r-md rounded-t-md hover:text-purple-500"
          >
            <a :href="message.text" target="_blank">
              {{ addSpaceInMessageIfTooLong(message.text) }}
            </a>
            <iframe
                width="240"
                v-bind:src="`https://www.youtube.com/embed/${
                message.text.split('watch?v=')[1]
              }`"
            >
            </iframe>

            <div class="mt-1 text-xs text-slate-500">
              {{ moment(message.createdAt).format("H:mm") }}
            </div>
          </div>
          <!-- Message youtube link Playlist YOU -->
          <div
              v-if="
              !message.isFile &&
              !message.isImage &&
              message.text.startsWith('https://www.youtube.com/') &&
              message.text.includes('list')
            "
              class="bg-slate-100 dark:bg-darkmode-400 px-4 py-3 text-slate-500 rounded-r-md rounded-t-md hover:text-purple-500"
          >
            <a :href="message.text" target="_blank">
              {{ addSpaceInMessageIfTooLong(message.text) }}
            </a>
            <img v-bind:src="message.youtubeThumbnail"/>

            <div class="mt-1 text-xs text-slate-500">
              {{ moment(message.createdAt).format("H:mm") }}
            </div>
          </div>
          <!-- Message Image YOU -->
          <div
              v-if="message.isImage === true && message.isFile === false"
              class="bg-slate-100 dark:bg-darkmode-400 px-4 py-3 text-slate-500 rounded-r-md rounded-t-md"
              @click="actionZoomImage(message.file.data)"
          >
            <img
                alt="picture"
                v-bind:src="`data:image/jpeg;base64,${message.file.data}`"
            />
            <div class="mt-1 text-xs text-slate-500">
              {{ moment(message.createdAt).format("H:mm") }}
            </div>
          </div>
          <!-- Message File YOU -->
          <div
              v-if="message.isFile === true && message.isImage === false"
              class="bg-slate-100 dark:bg-darkmode-400 px-4 py-3 text-slate-500 rounded-r-md rounded-t-md"
          >
            <div
                class="flex items-center h-6"
                @click="actionDownloadFile(message)"
            >
              <FolderIcon class="w-6 h-6 mr-2 cursor-pointer"/>
              {{ message.fileName }} {{ message.fileSize }} Byte
            </div>

            <div class="mt-1 text-xs text-slate-500">
              {{ moment(message.createdAt).format("H:mm") }}
            </div>
          </div>
        </div>
        <div
            v-if="user._id === message.sender"
            class="chat__box__text-box flex items-end float-right mb-4"
        >
          <Dropdown
              v-if="
              -moment(message.createdAt).diff(moment.now(), 'minutes') < 60 &&
              -moment(message.createdAt).diff(moment.now(), 'minutes') >= 0
            "
              class="hidden sm:block mr-3 my-auto"
          >
            <DropdownToggle
                tag="a"
                href="javascript:;"
                class="w-4 h-4 text-slate-500"
            >
              <MoreVerticalIcon class="w-4 h-4"/>
            </DropdownToggle>
            <DropdownMenu class="w-40">
              <DropdownContent>
                <DropdownItem @click="actionDeleteMessage(message)">
                  <TrashIcon class="w-4 h-4 mr-2"/>
                  Delete
                </DropdownItem>
              </DropdownContent>
            </DropdownMenu>
          </Dropdown>
          <!-- Message text ME -->
          <div
              v-if="
              !message.isFile &&
              !message.isImage &&
              !message.text.startsWith('http')
            "
              class="bg-primary px-4 py-3 text-white rounded-l-md rounded-t-md"
          >
            {{ addSpaceInMessageIfTooLong(message.text) }}
            <div class="mt-1 text-xs text-white text-opacity-80">
              {{ moment(message.createdAt).format("H:mm") }}
            </div>
          </div>
          <!-- Message Link ME -->
          <div
              v-if="
              !message.isFile &&
              !message.isImage &&
              message.text.startsWith('http') &&
              !message.text.startsWith('https://www.youtube.com/')
            "
              class="bg-primary px-4 py-3 text-white rounded-l-md rounded-t-md hover:text-purple-500"
          >
            <a :href="message.text" target="_blank">
              {{ addSpaceInMessageIfTooLong(message.text) }}
            </a>
            <div class="mt-1 text-xs text-white text-opacity-80">
              {{ moment(message.createdAt).format("H:mm") }}
            </div>
          </div>
          <!-- Message Link Youtube ME -->
          <div
              v-if="
              !message.isFile &&
              !message.isImage &&
              message.text.startsWith('https://www.youtube.com/') &&
              !message.text.includes('list')
            "
              class="bg-primary px-4 py-3 text-white rounded-l-md rounded-t-md hover:text-purple-500"
          >
            <a :href="message.text" target="_blank">
              {{ addSpaceInMessageIfTooLong(message.text) }}
            </a>
            <iframe
                width="240"
                v-bind:src="`https://www.youtube.com/embed/${
                message.text.split('watch?v=')[1]
              }`"
            >
            </iframe>
            <div class="mt-1 text-xs text-white text-opacity-80">
              {{ moment(message.createdAt).format("H:mm") }}
            </div>
          </div>
          <!-- Message Link Youtube Playlist ME -->
          <div
              v-if="
              !message.isFile &&
              !message.isImage &&
              message.text.startsWith('https://www.youtube.com/') &&
              message.text.includes('list')
            "
              class="bg-primary px-4 py-3 text-white rounded-l-md rounded-t-md hover:text-purple-500"
          >
            <a :href="message.text" target="_blank">
              {{ addSpaceInMessageIfTooLong(message.text) }}
            </a>
            <img v-bind:src="message.youtubeThumbnail"/>
            <div class="mt-1 text-xs text-white text-opacity-80">
              {{ moment(message.createdAt).format("H:mm") }}
            </div>
          </div>
          <!-- Message Image ME -->
          <div
              v-if="message.isImage === true && message.isFile === false"
              class="bg-primary px-4 py-3 text-white rounded-l-md rounded-t-md"
              @click="actionZoomImage(message.file.data)"
          >
            <img
                alt="picture"
                v-bind:src="`data:image/jpeg;base64,${message.file.data}`"
            />
            <div class="mt-1 text-xs text-white text-opacity-80">
              {{ moment(message.createdAt).format("H:mm") }}
            </div>
          </div>
          <!-- Message file ME -->
          <div
              v-if="message.isFile === true && message.isImage === false"
              class="bg-primary px-4 py-3 text-white rounded-l-md rounded-t-md"
          >
            <div
                class="flex items-center h-6"
                @click="actionDownloadFile(message)"
            >
              <FolderIcon class="w-6 h-6 mr-2 cursor-pointer"/>
              {{ message.fileName }}
            </div>
            <div
                class="mt-1 text-xs text-white text-opacity-80 flex justify-between"
            >
              <p>{{ moment(message.createdAt).format("H:mm") }}</p>
              <p>{{ message.fileSize }}</p>
            </div>
          </div>
          <div
              class="w-10 h-10 hidden sm:block flex-none image-fit relative ml-5"
          >
            <img
                alt="Midone Tailwind HTML Admin Template"
                class="rounded-full"
                v-bind:src="user.avatar"
            />
          </div>
        </div>
        <div class="clear-both"></div>
      </div>
      <div class="clear-both"></div>
      <div
          v-if="isTyping"
          class="chat__box__text-box flex items-end float-left mb-4"
      >
        <div
            class="w-10 h-10 hidden sm:block flex-none image-fit relative mr-5"
        >
          <img
              alt="Midone Tailwind HTML Admin Template"
              class="rounded-full"
              v-bind:src="receiver?.avatar"
          />
        </div>
        <div
            class="bg-slate-100 dark:bg-darkmode-400 px-4 py-3 text-slate-500 rounded-r-md rounded-t-md"
        >
          {{ receiver?.username }} is typing
          <span class="typing-dots ml-1">
            <span>.</span>
            <span>.</span>
            <span>.</span>
          </span>
        </div>
      </div>
    </div>
    <div v-if="!conversationStore.detailConversation.isBlock"
        class="pt-4 pb-10 sm:py-4 flex items-center border-t border-slate-200/60 dark:border-darkmode-400"
    >
      <textarea
          class="chat__box__input form-control dark:bg-darkmode-600 h-16 resize-none border-transparent px-5 py-3 shadow-none focus:border-transparent focus:ring-0"
          rows="1"
          placeholder="Type your message..."
          v-model="newMessage"
          v-on:keypress="actionStartTypingMessage"
          @focus="actionFocusInput"
          @keydown.enter.exact.prevent="actionSendMessage"
          @keydown.enter.shift.exact.prevent="newMessage += '\n'"
      ></textarea>

      <!-- Emoji And File  -->
      <div
          class="flex absolute sm:static left-0 bottom-0 ml-5 sm:ml-0 mb-5 sm:mb-0"
      >
        <Dropdown class="mr-3 sm:mr-5">
          <DropdownToggle
              tag="a"
              href="javascript:"
              class="w-4 h-4 sm:w-5 sm:h-5 block text-slate-500"
          >
            <SmileIcon class="w-full h-full"/>
          </DropdownToggle>
          <DropdownMenu class="chat-dropdown">
            <DropdownContent tag="div">
              <TabGroup
                  class="chat-dropdown__box flex flex-col"
                  :selectedIndex="1"
              >
                <div class="px-1 pt-1">
                  <div class="relative text-slate-500">
                    <input
                        type="text"
                        class="form-control border-transparent bg-slate-100 pr-10"
                        placeholder="Search emojis..."
                    />
                    <SearchIcon
                        class="w-4 h-4 absolute my-auto inset-y-0 mr-3 right-0"
                    />
                  </div>
                </div>
                <TabList class="chat-dropdown__box__tabs nav-pills px-1 mt-5">
                  <Tab
                      class="border-0 w-full px-0 py-2 hover:bg-slate-100 dark:hover:bg-darkmode-400"
                      tag="button"
                  >
                    <svg
                        class="w-4 h-4 mx-auto"
                        role="img"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                    >
                      <path
                          fill="currentColor"
                          d="M504 255.531c.253 136.64-111.18 248.372-247.82 248.468-59.015.042-113.223-20.53-155.822-54.911-11.077-8.94-11.905-25.541-1.839-35.607l11.267-11.267c8.609-8.609 22.353-9.551 31.891-1.984C173.062 425.135 212.781 440 256 440c101.705 0 184-82.311 184-184 0-101.705-82.311-184-184-184-48.814 0-93.149 18.969-126.068 49.932l50.754 50.754c10.08 10.08 2.941 27.314-11.313 27.314H24c-8.837 0-16-7.163-16-16V38.627c0-14.254 17.234-21.393 27.314-11.314l49.372 49.372C129.209 34.136 189.552 8 256 8c136.81 0 247.747 110.78 248 247.531zm-180.912 78.784l9.823-12.63c8.138-10.463 6.253-25.542-4.21-33.679L288 256.349V152c0-13.255-10.745-24-24-24h-16c-13.255 0-24 10.745-24 24v135.651l65.409 50.874c10.463 8.137 25.541 6.253 33.679-4.21z"
                      ></path>
                    </svg>
                  </Tab>
                  <Tab
                      class="border-0 w-full px-0 py-2 hover:bg-slate-100 dark:hover:bg-darkmode-400"
                      tag="button"
                  >
                    <svg
                        class="w-4 h-4 mx-auto"
                        role="img"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 496 512"
                    >
                      <path
                          fill="currentColor"
                          d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm0 448c-110.3 0-200-89.7-200-200S137.7 56 248 56s200 89.7 200 200-89.7 200-200 200zm-80-216c17.7 0 32-14.3 32-32s-14.3-32-32-32-32 14.3-32 32 14.3 32 32 32zm160 0c17.7 0 32-14.3 32-32s-14.3-32-32-32-32 14.3-32 32 14.3 32 32 32zm4 72.6c-20.8 25-51.5 39.4-84 39.4s-63.2-14.3-84-39.4c-8.5-10.2-23.7-11.5-33.8-3.1-10.2 8.5-11.5 23.6-3.1 33.8 30 36 74.1 56.6 120.9 56.6s90.9-20.6 120.9-56.6c8.5-10.2 7.1-25.3-3.1-33.8-10.1-8.4-25.3-7.1-33.8 3.1z"
                      ></path>
                    </svg>
                  </Tab>
                  <Tab
                      class="border-0 w-full px-0 py-2 hover:bg-slate-100 dark:hover:bg-darkmode-400"
                      tag="button"
                  >
                    <svg
                        class="w-4 h-4 mx-auto"
                        role="img"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                    >
                      <path
                          fill="currentColor"
                          d="M290.59 192c-20.18 0-106.82 1.98-162.59 85.95V192c0-52.94-43.06-96-96-96-17.67 0-32 14.33-32 32s14.33 32 32 32c17.64 0 32 14.36 32 32v256c0 35.3 28.7 64 64 64h176c8.84 0 16-7.16 16-16v-16c0-17.67-14.33-32-32-32h-32l128-96v144c0 8.84 7.16 16 16 16h32c8.84 0 16-7.16 16-16V289.86c-10.29 2.67-20.89 4.54-32 4.54-61.81 0-113.52-44.05-125.41-102.4zM448 96h-64l-64-64v134.4c0 53.02 42.98 96 96 96s96-42.98 96-96V32l-64 64zm-72 80c-8.84 0-16-7.16-16-16s7.16-16 16-16 16 7.16 16 16-7.16 16-16 16zm80 0c-8.84 0-16-7.16-16-16s7.16-16 16-16 16 7.16 16 16-7.16 16-16 16z"
                      ></path>
                    </svg>
                  </Tab>
                  <Tab
                      class="border-0 w-full px-0 py-2 hover:bg-slate-100 dark:hover:bg-darkmode-400"
                      tag="button"
                  >
                    <svg
                        class="w-4 h-4 mx-auto"
                        role="img"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 640 512"
                    >
                      <path
                          fill="currentColor"
                          d="M192 384h192c53 0 96-43 96-96h32c70.6 0 128-57.4 128-128S582.6 32 512 32H120c-13.3 0-24 10.7-24 24v232c0 53 43 96 96 96zM512 96c35.3 0 64 28.7 64 64s-28.7 64-64 64h-32V96h32zm47.7 384H48.3c-47.6 0-61-64-36-64h583.3c25 0 11.8 64-35.9 64z"
                      ></path>
                    </svg>
                  </Tab>
                  <Tab
                      class="border-0 w-full px-0 py-2 hover:bg-slate-100 dark:hover:bg-darkmode-400"
                      tag="button"
                  >
                    <svg
                        class="w-4 h-4 mx-auto"
                        role="img"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                    >
                      <path
                          fill="currentColor"
                          d="M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zm-48 0l-.003-.282-26.064 22.741-62.679-58.5 16.454-84.355 34.303 3.072c-24.889-34.216-60.004-60.089-100.709-73.141l13.651 31.939L256 139l-74.953-41.525 13.651-31.939c-40.631 13.028-75.78 38.87-100.709 73.141l34.565-3.073 16.192 84.355-62.678 58.5-26.064-22.741-.003.282c0 43.015 13.497 83.952 38.472 117.991l7.704-33.897 85.138 10.447 36.301 77.826-29.902 17.786c40.202 13.122 84.29 13.148 124.572 0l-29.902-17.786 36.301-77.826 85.138-10.447 7.704 33.897C442.503 339.952 456 299.015 456 256zm-248.102 69.571l-29.894-91.312L256 177.732l77.996 56.527-29.622 91.312h-96.476z"
                      ></path>
                    </svg>
                  </Tab>
                  <Tab
                      class="border-0 w-full px-0 py-2 hover:bg-slate-100 dark:hover:bg-darkmode-400"
                      tag="button"
                  >
                    <svg
                        class="w-4 h-4 mx-auto"
                        role="img"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 448 512"
                    >
                      <path
                          fill="currentColor"
                          d="M128 148v-40c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12h-40c-6.6 0-12-5.4-12-12zm140 12h40c6.6 0 12-5.4 12-12v-40c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12zm-128 96h40c6.6 0 12-5.4 12-12v-40c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12zm128 0h40c6.6 0 12-5.4 12-12v-40c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12zm-76 84v-40c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12zm76 12h40c6.6 0 12-5.4 12-12v-40c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12zm180 124v36H0v-36c0-6.6 5.4-12 12-12h19.5V24c0-13.3 10.7-24 24-24h337c13.3 0 24 10.7 24 24v440H436c6.6 0 12 5.4 12 12zM79.5 463H192v-67c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v67h112.5V49L80 48l-.5 415z"
                      ></path>
                    </svg>
                  </Tab>
                  <Tab
                      class="border-0 w-full px-0 py-2 hover:bg-slate-100 dark:hover:bg-darkmode-400"
                      tag="button"
                  >
                    <svg
                        class="w-4 h-4 mx-auto"
                        role="img"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 352 512"
                    >
                      <path
                          fill="currentColor"
                          d="M176 80c-52.94 0-96 43.06-96 96 0 8.84 7.16 16 16 16s16-7.16 16-16c0-35.3 28.72-64 64-64 8.84 0 16-7.16 16-16s-7.16-16-16-16zM96.06 459.17c0 3.15.93 6.22 2.68 8.84l24.51 36.84c2.97 4.46 7.97 7.14 13.32 7.14h78.85c5.36 0 10.36-2.68 13.32-7.14l24.51-36.84c1.74-2.62 2.67-5.7 2.68-8.84l.05-43.18H96.02l.04 43.18zM176 0C73.72 0 0 82.97 0 176c0 44.37 16.45 84.85 43.56 115.78 16.64 18.99 42.74 58.8 52.42 92.16v.06h48v-.12c-.01-4.77-.72-9.51-2.15-14.07-5.59-17.81-22.82-64.77-62.17-109.67-20.54-23.43-31.52-53.15-31.61-84.14-.2-73.64 59.67-128 127.95-128 70.58 0 128 57.42 128 128 0 30.97-11.24 60.85-31.65 84.14-39.11 44.61-56.42 91.47-62.1 109.46a47.507 47.507 0 0 0-2.22 14.3v.1h48v-.05c9.68-33.37 35.78-73.18 52.42-92.16C335.55 260.85 352 220.37 352 176 352 78.8 273.2 0 176 0z"
                      ></path>
                    </svg>
                  </Tab>
                  <Tab
                      class="border-0 w-full px-0 py-2 hover:bg-slate-100 dark:hover:bg-darkmode-400"
                      tag="button"
                  >
                    <svg
                        class="w-4 h-4 mx-auto"
                        role="img"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                    >
                      <path
                          fill="currentColor"
                          d="M511.99 32.01c0-21.71-21.1-37.01-41.6-30.51L150.4 96c-13.3 4.2-22.4 16.5-22.4 30.5v261.42c-10.05-2.38-20.72-3.92-32-3.92-53.02 0-96 28.65-96 64s42.98 64 96 64 96-28.65 96-64V214.31l256-75.02v184.63c-10.05-2.38-20.72-3.92-32-3.92-53.02 0-96 28.65-96 64s42.98 64 96 64 96-28.65 96-64l-.01-351.99z"
                      ></path>
                    </svg>
                  </Tab>
                </TabList>
                <TabPanels class="overflow-hidden mt-5">
                  <TabPanel>
                    <div class="font-medium px-1">Recent Emojis</div>
                    <div
                        class="h-full pb-10 overflow-y-auto scrollbar-hidden mt-2"
                    >
                      <div class="grid grid-cols-8 text-2xl">
                        <button
                            @click="choseIcon"
                            value="😀"
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                        >
                          😀
                        </button>
                        <button
                            @click="choseIcon"
                            value="😁"
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                        >
                          😁
                        </button>
                        <button
                            @click="choseIcon"
                            value="😂"
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                        >
                          😂
                        </button>
                      </div>
                    </div>
                  </TabPanel>
                  <TabPanel>
                    <div class="font-medium px-1">Smileys & People</div>
                    <div
                        class="h-full pb-10 overflow-y-auto scrollbar-hidden mt-2"
                    >
                      <div class="grid grid-cols-8 text-2xl">
                        <button
                            @click="choseIcon"
                            value="😀"
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                        >
                          😀
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="😁"
                        >
                          😁
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="😂"
                        >
                          😂
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🤣"
                        >
                          🤣
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="😃"
                        >
                          😃
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="😄"
                        >
                          😄
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="😅"
                        >
                          😅
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="😆"
                        >
                          😆
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="😉"
                        >
                          😉
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="😊"
                        >
                          😊
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="😋"
                        >
                          😋
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="😎"
                        >
                          😎
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="😍"
                        >
                          😍
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="😘"
                        >
                          😘
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="😗"
                        >
                          😗
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="😙"
                        >
                          😙
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="😚"
                        >
                          😚
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="☺️"
                        >
                          ☺️
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🙂"
                        >
                          🙂
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🤗"
                        >
                          🤗
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🤩"
                        >
                          🤩
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🤔"
                        >
                          🤔
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🤨"
                        >
                          🤨
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="😐"
                        >
                          😐
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="😑"
                        >
                          😑
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="😶"
                        >
                          😶
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🙄"
                        >
                          🙄
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="😏"
                        >
                          😏
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="😣"
                        >
                          😣
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="😥"
                        >
                          😥
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="😮"
                        >
                          😮
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🤐"
                        >
                          🤐
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="😯"
                        >
                          😯
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="😪"
                        >
                          😪
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="😫"
                        >
                          😫
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="😴"
                        >
                          😴
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="😌"
                        >
                          😌
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="😛"
                        >
                          😛
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="😜"
                        >
                          😜
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="😝"
                        >
                          😝
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🤤"
                        >
                          🤤
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="😒"
                        >
                          😒
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="😓"
                        >
                          😓
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="😔"
                        >
                          😔
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="😕"
                        >
                          😕
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🙃"
                        >
                          🙃
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🤑"
                        >
                          🤑
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="😲"
                        >
                          😲
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="☹️"
                        >
                          ☹️
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🙁"
                        >
                          🙁
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="😖"
                        >
                          😖
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="😞"
                        >
                          😞
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="😟"
                        >
                          😟
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="😤"
                        >
                          😤
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="😢"
                        >
                          😢
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="😭"
                        >
                          😭
                        </button>
                      </div>
                    </div>
                  </TabPanel>
                  <TabPanel>
                    <div class="font-medium px-1">Animals & Nature</div>
                    <div
                        class="h-full pb-10 overflow-y-auto scrollbar-hidden mt-2"
                    >
                      <div class="grid grid-cols-8 text-2xl">
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🐵"
                        >
                          🐵
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🐒"
                        >
                          🐒
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🦍"
                        >
                          🦍
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🐶"
                        >
                          🐶
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🐕"
                        >
                          🐕
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🐩"
                        >
                          🐩
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🐺"
                        >
                          🐺
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🦊"
                        >
                          🦊
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🐱"
                        >
                          🐱
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🐈"
                        >
                          🐈
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🦁"
                        >
                          🦁
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🐯"
                        >
                          🐯
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🐅"
                        >
                          🐅
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🐆"
                        >
                          🐆
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🐴"
                        >
                          🐴
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🐎"
                        >
                          🐎
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🦄"
                        >
                          🦄
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🦓"
                        >
                          🦓
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🦌"
                        >
                          🦌
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🐮"
                        >
                          🐮
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🐂"
                        >
                          🐂
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🐃"
                        >
                          🐃
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🐄"
                        >
                          🐄
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🐷"
                        >
                          🐷
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🐖"
                        >
                          🐖
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🐗"
                        >
                          🐗
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🐽"
                        >
                          🐽
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🐏"
                        >
                          🐏
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🐑"
                        >
                          🐑
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🐐"
                        >
                          🐐
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🐪"
                        >
                          🐪
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🐫"
                        >
                          🐫
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🦒"
                        >
                          🦒
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🐘"
                        >
                          🐘
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🦏"
                        >
                          🦏
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🐭"
                        >
                          🐭
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🐁"
                        >
                          🐁
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🐀"
                        >
                          🐀
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🐹"
                        >
                          🐹
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🐰"
                        >
                          🐰
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🐇"
                        >
                          🐇
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🐿️"
                        >
                          🐿️
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🦔"
                        >
                          🦔
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🦇"
                        >
                          🦇
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🐻"
                        >
                          🐻
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🐨"
                        >
                          🐨
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🐼"
                        >
                          🐼
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🐾"
                        >
                          🐾
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🦃"
                        >
                          🦃
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🐔"
                        >
                          🐔
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🐓"
                        >
                          🐓
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🐣"
                        >
                          🐣
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🐤"
                        >
                          🐤
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🐥"
                        >
                          🐥
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🐦"
                        >
                          🐦
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🐧"
                        >
                          🐧
                        </button>
                      </div>
                    </div>
                  </TabPanel>
                  <TabPanel>
                    <div class="font-medium px-1">Food & Drink</div>
                    <div
                        class="h-full pb-10 overflow-y-auto scrollbar-hidden mt-2"
                    >
                      <div class="grid grid-cols-8 text-2xl">
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🍇"
                        >
                          🍇
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🍈"
                        >
                          🍈
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🍉"
                        >
                          🍉
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🍊"
                        >
                          🍊
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🍋"
                        >
                          🍋
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🍌"
                        >
                          🍌
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🍍"
                        >
                          🍍
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🍎"
                        >
                          🍎
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🍏"
                        >
                          🍏
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🍐"
                        >
                          🍐
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🍑"
                        >
                          🍑
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🍒"
                        >
                          🍒
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🍓"
                        >
                          🍓
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🥝"
                        >
                          🥝
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🍅"
                        >
                          🍅
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🥥"
                        >
                          🥥
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🥑"
                        >
                          🥑
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🍆"
                        >
                          🍆
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🥔"
                        >
                          🥔
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🥕"
                        >
                          🥕
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🌽"
                        >
                          🌽
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🌶️"
                        >
                          🌶️
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🥒"
                        >
                          🥒
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🥦"
                        >
                          🥦
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🍄"
                        >
                          🍄
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🥜"
                        >
                          🥜
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🌰"
                        >
                          🌰
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🍞"
                        >
                          🍞
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🥐"
                        >
                          🥐
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🥖"
                        >
                          🥖
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🥨"
                        >
                          🥨
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🥞"
                        >
                          🥞
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🧀"
                        >
                          🧀
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🍖"
                        >
                          🍖
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🍗"
                        >
                          🍗
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🥩"
                        >
                          🥩
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🥓"
                        >
                          🥓
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🍔"
                        >
                          🍔
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🍟"
                        >
                          🍟
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🍕"
                        >
                          🍕
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🌭"
                        >
                          🌭
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🥪"
                        >
                          🥪
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🌮"
                        >
                          🌮
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🌯"
                        >
                          🌯
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🥙"
                        >
                          🥙
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🥚"
                        >
                          🥚
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🍳"
                        >
                          🍳
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🥘"
                        >
                          🥘
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🍲"
                        >
                          🍲
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🥣"
                        >
                          🥣
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🥗"
                        >
                          🥗
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🍿"
                        >
                          🍿
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🥫"
                        >
                          🥫
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🍱"
                        >
                          🍱
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🍘"
                        >
                          🍘
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🍙"
                        >
                          🍙
                        </button>
                      </div>
                    </div>
                  </TabPanel>
                  <TabPanel>
                    <div class="font-medium px-1">Activities</div>
                    <div
                        class="h-full pb-10 overflow-y-auto scrollbar-hidden mt-2"
                    >
                      <div class="grid grid-cols-8 text-2xl">
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🎃"
                        >
                          🎃
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🎄"
                        >
                          🎄
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🎆"
                        >
                          🎆
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🎇"
                        >
                          🎇
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="✨"
                        >
                          ✨
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🎈"
                        >
                          🎈
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🎉"
                        >
                          🎉
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🎊"
                        >
                          🎊
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🎋"
                        >
                          🎋
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🎍"
                        >
                          🎍
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🎎"
                        >
                          🎎
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🎏"
                        >
                          🎏
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🎐"
                        >
                          🎐
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🎑"
                        >
                          🎑
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🎀"
                        >
                          🎀
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🎁"
                        >
                          🎁
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🎗️"
                        >
                          🎗️
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🎟️"
                        >
                          🎟️
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🎫"
                        >
                          🎫
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🎖️"
                        >
                          🎖️
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🏆"
                        >
                          🏆
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🏅"
                        >
                          🏅
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🥇"
                        >
                          🥇
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🥈"
                        >
                          🥈
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🥉"
                        >
                          🥉
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="⚽"
                        >
                          ⚽
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="⚾"
                        >
                          ⚾
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🏀"
                        >
                          🏀
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🏐"
                        >
                          🏐
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🏈"
                        >
                          🏈
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🏉"
                        >
                          🏉
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🎾"
                        >
                          🎾
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🎱"
                        >
                          🎱
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🎳"
                        >
                          🎳
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🏏"
                        >
                          🏏
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🏑"
                        >
                          🏑
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🏒"
                        >
                          🏒
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🏓"
                        >
                          🏓
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🏸"
                        >
                          🏸
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🥊"
                        >
                          🥊
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🥋"
                        >
                          🥋
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🥅"
                        >
                          🥅
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🎯"
                        >
                          🎯
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="⛳"
                        >
                          ⛳
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="⛸️"
                        >
                          ⛸️
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🎣"
                        >
                          🎣
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🎽"
                        >
                          🎽
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🎿"
                        >
                          🎿
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🛷"
                        >
                          🛷
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🥌"
                        >
                          🥌
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🎮"
                        >
                          🎮
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🕹️"
                        >
                          🕹️
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🎲"
                        >
                          🎲
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="♠️"
                        >
                          ♠️
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="♥️"
                        >
                          ♥️
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="♦️"
                        >
                          ♦️
                        </button>
                      </div>
                    </div>
                  </TabPanel>
                  <TabPanel>
                    <div class="font-medium px-1">Travel & Places</div>
                    <div
                        class="h-full pb-10 overflow-y-auto scrollbar-hidden mt-2"
                    >
                      <div class="grid grid-cols-8 text-2xl">
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🌍"
                        >
                          🌍
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🌎"
                        >
                          🌎
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🌏"
                        >
                          🌏
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🌐"
                        >
                          🌐
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🗺️"
                        >
                          🗺️
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🗾"
                        >
                          🗾
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🏔️"
                        >
                          🏔️
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="⛰️"
                        >
                          ⛰️
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🌋"
                        >
                          🌋
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🗻"
                        >
                          🗻
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🏕️"
                        >
                          🏕️
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🏖️"
                        >
                          🏖️
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🏜️"
                        >
                          🏜️
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🏝️"
                        >
                          🏝️
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🏞️"
                        >
                          🏞️
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🏟️"
                        >
                          🏟️
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🏛️"
                        >
                          🏛️
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🏗️"
                        >
                          🏗️
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🏘️"
                        >
                          🏘️
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🏙️"
                        >
                          🏙️
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🏚️"
                        >
                          🏚️
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🏠"
                        >
                          🏠
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🏡"
                        >
                          🏡
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🏢"
                        >
                          🏢
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🏣"
                        >
                          🏣
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🏤"
                        >
                          🏤
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🏥"
                        >
                          🏥
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🏦"
                        >
                          🏦
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🏨"
                        >
                          🏨
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🏩"
                        >
                          🏩
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🏪"
                        >
                          🏪
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🏫"
                        >
                          🏫
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🏬"
                        >
                          🏬
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🏭"
                        >
                          🏭
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🏯"
                        >
                          🏯
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🏰"
                        >
                          🏰
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="💒"
                        >
                          💒
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🗼"
                        >
                          🗼
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🗽"
                        >
                          🗽
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="⛪"
                        >
                          ⛪
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🕌"
                        >
                          🕌
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🕍"
                        >
                          🕍
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="⛩️"
                        >
                          ⛩️
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🕋"
                        >
                          🕋
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="⛲"
                        >
                          ⛲
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="⛺"
                        >
                          ⛺
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🌁"
                        >
                          🌁
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🌃"
                        >
                          🌃
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🌄"
                        >
                          🌄
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🌅"
                        >
                          🌅
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🌆"
                        >
                          🌆
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🌇"
                        >
                          🌇
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🌉"
                        >
                          🌉
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="♨️"
                        >
                          ♨️
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🌌"
                        >
                          🌌
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🎠"
                        >
                          🎠
                        </button>
                      </div>
                    </div>
                  </TabPanel>
                  <TabPanel>
                    <div class="font-medium px-1">Objects</div>
                    <div
                        class="h-full pb-10 overflow-y-auto scrollbar-hidden mt-2"
                    >
                      <div class="grid grid-cols-8 text-2xl">
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🔇"
                        >
                          🔇
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🔈"
                        >
                          🔈
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🔉"
                        >
                          🔉
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🔊"
                        >
                          🔊
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="📢"
                        >
                          📢
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="📣"
                        >
                          📣
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="📯"
                        >
                          📯
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🔔"
                        >
                          🔔
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🔕"
                        >
                          🔕
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🎼"
                        >
                          🎼
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🎵"
                        >
                          🎵
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🎶"
                        >
                          🎶
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🎙️"
                        >
                          🎙️
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🎚️"
                        >
                          🎚️
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🎛️"
                        >
                          🎛️
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🎤"
                        >
                          🎤
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🎧"
                        >
                          🎧
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="📻"
                        >
                          📻
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🎷"
                        >
                          🎷
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🎸"
                        >
                          🎸
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🎹"
                        >
                          🎹
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🎺"
                        >
                          🎺
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🎻"
                        >
                          🎻
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🥁"
                        >
                          🥁
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="📱"
                        >
                          📱
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="📲"
                        >
                          📲
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="☎️"
                        >
                          ☎️
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="📞"
                        >
                          📞
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="📟"
                        >
                          📟
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="📠"
                        >
                          📠
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🔋"
                        >
                          🔋
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🔌"
                        >
                          🔌
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="💻"
                        >
                          💻
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🖥️"
                        >
                          🖥️
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🖨️"
                        >
                          🖨️
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="⌨️"
                        >
                          ⌨️
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🖱️"
                        >
                          🖱️
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🖲️"
                        >
                          🖲️
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="💽"
                        >
                          💽
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="💾"
                        >
                          💾
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="💿"
                        >
                          💿
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="📀"
                        >
                          📀
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🎥"
                        >
                          🎥
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🎞️"
                        >
                          🎞️
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="📽️"
                        >
                          📽️
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🎬"
                        >
                          🎬
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="📺"
                        >
                          📺
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="📷"
                        >
                          📷
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="📸"
                        >
                          📸
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="📹"
                        >
                          📹
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="📼"
                        >
                          📼
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🔍"
                        >
                          🔍
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🔎"
                        >
                          🔎
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🔬"
                        >
                          🔬
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🔭"
                        >
                          🔭
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="📡"
                        >
                          📡
                        </button>
                      </div>
                    </div>
                  </TabPanel>
                  <TabPanel>
                    <div class="font-medium px-1">Symbols</div>
                    <div
                        class="h-full pb-10 overflow-y-auto scrollbar-hidden mt-2"
                    >
                      <div class="grid grid-cols-8 text-2xl">
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🏧"
                        >
                          🏧
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🚮"
                        >
                          🚮
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🚰"
                        >
                          🚰
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="♿"
                        >
                          ♿
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🚹"
                        >
                          🚹
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🚺"
                        >
                          🚺
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🚻"
                        >
                          🚻
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🚼"
                        >
                          🚼
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🚾"
                        >
                          🚾
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🛂"
                        >
                          🛂
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🛃"
                        >
                          🛃
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🛄"
                        >
                          🛄
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🛅"
                        >
                          🛅
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="⚠️"
                        >
                          ⚠️
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🚸"
                        >
                          🚸
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="⛔"
                        >
                          ⛔
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🚫"
                        >
                          🚫
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🚳"
                        >
                          🚳
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🚭"
                        >
                          🚭
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🚯"
                        >
                          🚯
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🚱"
                        >
                          🚱
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🚷"
                        >
                          🚷
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="📵"
                        >
                          📵
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🔞"
                        >
                          🔞
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="☢️"
                        >
                          ☢️
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="☣️"
                        >
                          ☣️
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="⬆️"
                        >
                          ⬆️
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="↗️"
                        >
                          ↗️
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="➡️"
                        >
                          ➡️
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="↘️"
                        >
                          ↘️
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="⬇️"
                        >
                          ⬇️
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="↙️"
                        >
                          ↙️
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="⬅️"
                        >
                          ⬅️
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="↖️"
                        >
                          ↖️
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="↕️"
                        >
                          ↕️
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="↔️"
                        >
                          ↔️
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="↩️"
                        >
                          ↩️
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="↪️"
                        >
                          ↪️
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="⤴️"
                        >
                          ⤴️
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="⤵️"
                        >
                          ⤵️
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🔃"
                        >
                          🔃
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🔄"
                        >
                          🔄
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🔙"
                        >
                          🔙
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🔚"
                        >
                          🔚
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🔛"
                        >
                          🔛
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🔜"
                        >
                          🔜
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🔝"
                        >
                          🔝
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🛐"
                        >
                          🛐
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="⚛️"
                        >
                          ⚛️
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="🕉️"
                        >
                          🕉️
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="✡️"
                        >
                          ✡️
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="☸️"
                        >
                          ☸️
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="☯️"
                        >
                          ☯️
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="✝️"
                        >
                          ✝️
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="☦️"
                        >
                          ☦️
                        </button>
                        <button
                            class="rounded focus:outline-none hover:bg-slate-100 dark:hover:bg-darkmode-400"
                            @click="choseIcon"
                            value="☪️"
                        >
                          ☪️
                        </button>
                      </div>
                    </div>
                  </TabPanel>
                </TabPanels>
              </TabGroup>
            </DropdownContent>
          </DropdownMenu>
        </Dropdown>
        <div class="w-4 h-4 sm:w-5 sm:h-5 relative text-slate-500 mr-3 sm:mr-5">
          <PaperclipIcon class="w-full h-full"/>
          <input
              type="file"
              @change="previewFiles"
              @keydown.enter.exact.prevent="actionSendMessage"
              class="w-full h-full top-0 left-0 absolute opacity-0"
          />
        </div>
      </div>
      <a
          @click="actionSendMessage"
          href="javascript:"
          class="w-8 h-8 sm:w-10 sm:h-10 block bg-primary text-white rounded-full flex-none flex items-center justify-center mr-5"
      >
        <SendIcon class="w-4 h-4"/>
      </a>
    </div>
    <div v-else  class="pt-4 pb-10 sm:py-4  border-t border-slate-200/60 dark:border-darkmode-400 px-auto bg-blue-400 text-center">
      Sorry, you can't reply to this conversation. Learn more
    </div>
  </div>
</template>

<script lang="ts">
import {ref, watch} from "vue";
import {useAuthStore} from "../stores/auth-store";
import moment from "moment";
import {useConversationStore} from "../stores/conversation-store";
import {Message} from "../types/message-type";
import {Conversation, FindListConversation} from "../types/conversation-type";
import ConversationService from "../services/ConversationService";
import {
  setNotificationFailedWhenGetData,
  setNotificationToastMessage,
} from "../utils/MyFunction";
import MessageService from "../services/MessageService";
import {UserInfor} from "../types/user-type";
import FileSaver from "file-saver";
import ZoomImage from "./ZoomImage.vue";
import youtubeThumbnail from "youtube-thumbnail";

export default {
  name: "ChatActive",
  props: ["socket"],
  components: {ZoomImage},
  // @ts-ignore
  setup(props) {
    const newMessage = ref("");
    const messageList = ref<Message[]>([]);
    const conversationId = ref<string>("");
    const receiver = ref<UserInfor>();
    const isTyping = ref(false);
    const deleteMessageId = ref("");
    const base64Image = ref("");
    let formData = new FormData();
    const chosenFile: any = ref(null);
    const skip = ref(0);
    const totalMessage = ref(9);
    const fileSize = ref("");
    const youtubeLinkThumbnail = ref("");
    const youtubeOption: any = ref({});
    const conversationBlock = ref(false)

    const authStore = useAuthStore();
    const conversationStore = useConversationStore();
    const user = authStore.currentUser.userInfor;

    const previewFiles = async (event) => {
      let fileToUpload = event.target.files[0];
      chosenFile.value = event.target.files[0];
      getBase64(event.target.files[0]);

      if (fileToUpload.size < 1048576) {
        fileSize.value = `${Math.ceil(fileToUpload.size / 1024)} KB`;
      } else {
        fileSize.value = `${Math.ceil(fileToUpload.size / 1048576)} MB`;
      }

      formData.append("singleFile", fileToUpload);
      formData.append("fileSize", fileSize.value);
      newMessage.value = `File ${chosenFile.value.name}`;
    };

    const choseIcon = (event) => {
      newMessage.value = newMessage.value + event.target.value;
    };

    const handleScroll = (e) => {
      const {scrollTop} = e.target;

      if (scrollTop < 1500) {
        skip.value = messageList.value.length;
      }
    };

    function actionZoomImage(imageLink) {
      conversationStore.openBiggerImage();
      conversationStore.getZoomImage(imageLink);
    }

    watch(
        () => conversationStore.detailConversation,
        async (detailConversation: Conversation) => {
          conversationId.value = detailConversation._id;
          receiver.value = await detailConversation.userDetails[0];
          messageList.value = [];
          skip.value = 0;
          totalMessage.value = 9;
          conversationBlock.value = detailConversation.isBlock
          await findAllMessagesInConversation(conversationId.value);
          const element: HTMLElement | any = await document.getElementById(
              "message-box"
          );
          element.scrollTop = element.scrollHeight;
          findListConversation();
        }
    );

    watch(
        () => skip.value,
        (val: number) => {
          if (val > 0 && val < totalMessage.value) {
            findAllMessagesInConversation(
                conversationStore.detailConversation._id
            );
          }
        }
    );

    async function findListConversation() {
      // conversationStore.openLoadingScreen()
      const data = {} as FindListConversation;
      const response = await ConversationService.findList(data);

      if (response.data) {
        if (response.data.success) {
          conversationStore.getListConversations(response.data.values);
        } else {
          setNotificationToastMessage(response.data.message, false);
        }
      } else {
        setNotificationFailedWhenGetData();
      }
    }

    async function actionSaveMessage(messageData: any) {
      const response = await MessageService.save(messageData);
      if (response.data) {
        if (!response.data.success) {
          setNotificationToastMessage(response.data.message, false);
        }
      } else {
        setNotificationFailedWhenGetData();
      }
    }

    async function findAllMessagesInConversation(conversationId: string) {
      if (skip.value === 0) {
        conversationStore.openLoadingScreen();
      }

      const data = {
        conversationId: conversationId,
        skip: skip.value,
      } as Message;

      const response = await MessageService.findAll(data);
      if (response.data) {
        console.log("response.data", response.data)
        if (response.data.success) {
          totalMessage.value = response.data?.values[0]?.totalMessage;
          if (skip.value === 0) {
            messageList.value = response.data.values;
          } else {
            messageList.value = [...response.data.values, ...messageList.value];
          }
          conversationStore.closeLoadingScreen();
        } else {
          setNotificationToastMessage(response.data.message, false);
        }
      } else {
        setNotificationFailedWhenGetData();
      }
    }

    function actionInitDeleteMessage(message: Message) {
      deleteMessageId.value = message._id;
    }

    async function actionDeleteMessage(message: Message) {
      const indexOfMessage = messageList.value.findIndex(
          (value) => value.timeCreated === message.timeCreated
      );
      if (indexOfMessage >= 0) {
        messageList.value.splice(indexOfMessage, 1);
      }
      const data = message;
      const response = await MessageService.delete(data);
      if (response.data) {
        if (response.data.success) {
          props.socket.emit("listen_message_change", {});
          skip.value = await 0;
          messageList.value = [];
          findAllMessagesInConversation(message.conversationId);

          const element: HTMLElement | any = await document.getElementById(
              "message-box"
          );
          element.scrollTop = element.scrollHeight;
        } else {
          setNotificationToastMessage(response.data.message, false);
        }
      } else {
        setNotificationFailedWhenGetData();
      }
    }

    async function actionMarkReadMessage(conversationId: string) {
      const data = {
        conversationId: conversationId,
      } as Message;
      const response = await MessageService.markRead(data);

      if (response.data) {
        if (!response.data.success) {
          setNotificationToastMessage(response.data.message, false);
        }
      } else {
        setNotificationFailedWhenGetData();
      }
    }

    async function actionFocusInput() {
      if (messageList.value.slice(-1)[0].sender !== user._id) {
        actionMarkReadMessage(conversationId.value);
        props.socket.emit("listen_message_change", {});
      }
    }

    async function actionDownloadFile(data: Message) {
      const response = await MessageService.downloadFile(data);

      if (response.data) {
        const file = new File([response.data], data.fileName, {
          type: "text/plain;charset=utf-8",
        });
        FileSaver.saveAs(file);
      } else {
        setNotificationFailedWhenGetData();
      }
    }

    function getBase64(file) {
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function () {
        const base64 = String(reader.result);
        const value = base64.split("base64,")[1];
        base64Image.value = value;
      };
    }

    props.socket.on("start_typing_message", async (data: Message) => {
      if (data.sender !== user._id) {
        isTyping.value = true;
      } else {
        isTyping.value = false;
      }

      // Scroll tới cuối Div
      const element: HTMLElement | any = await document.getElementById(
          "message-box"
      );
      element.scrollTop = element.scrollHeight;
    });

    if (newMessage.value === "") {
      props.socket.on("stop_typing_message", (data: Message) => {
        if (data.sender !== user._id) {
          isTyping.value = false;
        }
      });
    }

    function actionStartTypingMessage() {
      const startTypingMessageData = {
        conversationId: conversationId.value,
        sender: user._id,
      } as Message;
      props.socket.emit("start_typing_message", startTypingMessageData);
    }

    watch(
        () => newMessage.value,
        (value: string) => {
          if (value === "") {
            const stopTypingMessageData = {
              conversationId: conversationId.value,
              sender: user._id,
            } as Message;
            props.socket.emit("stop_typing_message", stopTypingMessageData);
          }
        }
    );

    function addSpaceInMessageIfTooLong(message: string) {
      if (message.includes(" ")) {
        return message;
      } else {
        // Nếu ko có space thì add thêm Space mỗi 27 ký tự
        const messageSplit = message.match(/.{1,27}/g) || [];
        return messageSplit.join(" ");
      }
    }

    // @ts-ignore
    async function actionSendMessage(event) {
      event.preventDefault();
      let messageData = {} as Message;

      if (
          newMessage.value !== "" &&
          newMessage.value !== "\n" &&
          newMessage.value !== "\n\n" &&
          newMessage.value !== "\n\n\n" &&
          newMessage.value !== "\n\n\n\n" &&
          newMessage.value !== "\n\n\n\n\n" &&
          conversationId.value &&
          user &&
          receiver.value
      ) {
        formData.append("conversationId", conversationId.value);
        formData.append("sender", user._id);
        formData.append("receiver", receiver.value._id);
        formData.append(
            "timeCreated",
            moment().format("D-MMM-YYYY-H-mm-SSSSSSSSS")
        );
        await formData.append("text", newMessage.value);

        if (newMessage.value.startsWith("https://www.youtube.com/")) {
          youtubeOption.value = youtubeThumbnail(newMessage.value);
          youtubeLinkThumbnail.value = youtubeOption.value.medium.url;
        }

        formData.append("youtubeThumbnail", youtubeLinkThumbnail.value);

        // Text message
        if (chosenFile.value === null) {
          messageData = {
            conversationId: conversationId.value,
            sender: user._id,
            text: newMessage.value,
            receiver: receiver.value._id,
            isImage: false,
            isFile: false,
            file: {
              data: null,
            },
            fileSize: fileSize.value,
            fileName: "",
            dayCreated: moment().format("D MMM YYYY"),
            timeCreated: moment().format("D-MMM-YYYY-H-mm-SSSSSSSSS"),
            youtubeThumbnail: youtubeLinkThumbnail.value,
          } as Message;

          formData.append("isImage", "false");
          formData.append("isFile", "false");
          formData.append("singleFile", "null");
          formData.append("fileName", "");
        } else {
          // Image message
          if (
              chosenFile.value.name.includes(".jpg") ||
              chosenFile.value.name.includes(".pdf") ||
              chosenFile.value.name.includes(".eps") ||
              chosenFile.value.name.includes(".ai") ||
              chosenFile.value.name.includes(".webp") ||
              chosenFile.value.name.includes(".indd") ||
              chosenFile.value.name.includes(".raw") ||
              chosenFile.value.name.includes(".jpeg") ||
              chosenFile.value.name.includes(".psd") ||
              chosenFile.value.name.includes(".png") ||
              chosenFile.value.name.includes(".gif") ||
              chosenFile.value.name.includes(".tiff") ||
              chosenFile.value.name.includes(".bmp") ||
              chosenFile.value.name.includes(".jfif")
          ) {
            newMessage.value = "Image";
            messageData = {
              conversationId: conversationId.value,
              sender: user._id,
              text: newMessage.value,
              receiver: receiver.value._id,
              isImage: true,
              isFile: false,
              fileSize: fileSize.value,
              file: {
                data: base64Image.value,
              },
              fileName: chosenFile?.value?.name,
              dayCreated: moment().format("D MMM YYYY"),
              timeCreated: moment().format("D-MMM-YYYY-H-mm-SSSSSSSSS"),
              youtubeThumbnail: youtubeLinkThumbnail.value,
            } as Message;

            formData.append("isImage", "true");
            formData.append("isFile", "false");
            formData.append("fileName", chosenFile.value.name);
          }
          // File Message
          else {
            newMessage.value = "File";
            messageData = {
              conversationId: conversationId.value,
              sender: user._id,
              text: newMessage.value,
              receiver: receiver.value._id,
              isImage: false,
              isFile: true,
              fileSize: fileSize.value,
              file: {
                data: null,
              },
              fileName: chosenFile?.value?.name,
              dayCreated: moment().format("D MMM YYYY"),
              timeCreated: moment().format("D-MMM-YYYY-H-mm-SSSSSSSSS"),
              youtubeThumbnail: youtubeLinkThumbnail.value,
            } as Message;

            formData.append("isImage", "false");
            formData.append("isFile", "true");
            formData.append("fileName", chosenFile.value.name);
          }
        }

        await props.socket.emit("send_message", messageData);
        actionSaveMessage(formData);
        props.socket.emit("listen_message_change", {});
        findListConversation();
        newMessage.value = "";
        chosenFile.value = null;
        formData = new FormData();
        youtubeOption.value = {};
      }
    }

    props.socket.on("receive_message", async (data: Message) => {
      messageList.value = [...messageList.value, data];

      // Scroll xuống dưới cùng
      const element: HTMLElement | any = await document.getElementById(
          "message-box"
      );
      element.scrollTop = element.scrollHeight;
    });
    return {
      newMessage,
      messageList,
      actionSendMessage,
      user,
      receiver,
      conversationStore,
      moment,
      previewFiles,
      choseIcon,
      actionStartTypingMessage,
      isTyping,
      actionDeleteMessage,
      actionInitDeleteMessage,
      actionDownloadFile,
      handleScroll,
      actionFocusInput,
      actionZoomImage,
      findAllMessagesInConversation,
      youtubeLinkThumbnail,
      addSpaceInMessageIfTooLong,
      conversationBlock
    };
  },
};
</script>