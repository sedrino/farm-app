import {
  SimpleLeftMenuLayout,
  SimpleNavLink,
  SimpleVerticalNavSection,
} from "@/components/layouts/simple-left-menu-layout";
import { Content } from "@/components/ui/layouts/content";
import { PageHeader } from "@/components/ui/layouts/page-header";
import { Separator } from "@/components/ui/separator";
import { pageBreadcrumb, pageTitle, title } from "@/components/ui/typography";
import { Outlet, createFileRoute } from "@tanstack/react-router";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LinkTabs } from "@/components/ui/link-tabs";

export const Route = createFileRoute("/layouts/app/basic/tabs/password")({
  component: () => (
    <div className="bg-surface-100 border-default overflow-hidden  rounded-md border shadow">
      <div className="divide-border flex flex-col gap-0 divide-y">
        <div className="undefined grid grid-cols-12 gap-6 px-8  py-8 opacity-100">
          <label className="text-foreground col-span-12 text-sm lg:col-span-5 ">
            Manage Password
          </label>
          <div
            className="
        undefined undefined relative col-span-12 flex flex-col
        gap-6
        lg:col-span-7
      "
          >
            <div className="grid gap-2 text-sm leading-4 md:grid md:grid-cols-12">
              <div className="col-span-12 flex flex-row justify-between space-x-2">
                <label className="text-foreground-light block text-sm leading-4">
                  Organization name
                </label>
              </div>
              <div className="col-span-12">
                <div className="">
                  <div className="relative">
                    <input
                      data-size="small"
                      id="name"
                      name=""
                      type="text"
                      className="peer/input text-foreground focus-visible:border-foreground-muted focus-visible:ring-background-control placeholder-foreground-muted bg-foreground/[.026] border-control group box-border block w-full rounded-md border px-3 py-2 text-sm leading-4 shadow-sm outline-none transition-all focus:ring-2 focus:ring-current focus-visible:shadow-md"
                      value="Sedrino"
                    />
                  </div>
                </div>
                <p
                  data-state="hide"
                  className="
        data-show:mt-2
        data-show:animate-slide-down-normal
        data-hide:animate-slide-up-normal
        text-sm
        leading-4
       text-red-900 transition-all"
                ></p>
              </div>
            </div>
            <div className="grid gap-2 text-sm leading-4 md:grid md:grid-cols-12">
              <div className="col-span-12 flex flex-row justify-between space-x-2">
                <label className="text-foreground-light block text-sm leading-4">
                  Organization slug
                </label>
              </div>
              <div className="col-span-12">
                <div className="">
                  <div className="relative">
                    <input
                      data-size="small"
                      id="slug"
                      name=""
                      type="text"
                      className="peer/input text-foreground focus-visible:border-foreground-muted focus-visible:ring-background-control placeholder-foreground-muted bg-foreground/[.026] border-control group box-border block w-full rounded-md border px-3 py-2 text-sm leading-4 opacity-50 shadow-sm outline-none transition-all focus:ring-2 focus:ring-current focus-visible:shadow-md"
                      value=""
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center space-x-1 pl-3 pr-1">
                      <button
                        data-size="tiny"
                        type="button"
                        className="font-regular text-foreground bg-button hover:bg-selection border-button hover:border-button-hover focus-visible:outline-brand-600 data-[state=open]:bg-selection data-[state=open]:outline-brand-600 data-[state=open]:border-button-hover relative inline-flex h-[26px] cursor-pointer items-center justify-center space-x-2 rounded-md border px-2.5 py-1 text-center text-xs shadow-sm outline-none outline-0 transition-all duration-200 ease-out focus-visible:outline-4 focus-visible:outline-offset-1"
                      >
                        <div className="[&_svg]:h-[14px] [&_svg]:w-[14px]">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            className="sbui-icon"
                          >
                            <rect
                              x="9"
                              y="9"
                              width="13"
                              height="13"
                              rx="2"
                              ry="2"
                            ></rect>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                          </svg>
                        </div>{" "}
                        <span className="truncate">Copy</span>{" "}
                      </button>
                    </div>
                  </div>
                </div>
                <p
                  data-state="hide"
                  className="
        data-show:mt-2
        data-show:animate-slide-down-normal
        data-hide:animate-slide-up-normal
        text-sm
        leading-4
       text-red-900 transition-all"
                ></p>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex flex-row gap-6 text-sm leading-4">
                <div className="">
                  <button
                    type="button"
                    id="isOptedIntoAi"
                    name="isOptedIntoAi"
                    className=" focus:!ring-border bg-foreground-muted/40 hover:bg-foreground-muted/60 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent p-0 outline-none transition-colors duration-200 ease-in-out  focus:ring-2 focus:ring-current"
                  >
                    <span
                      aria-hidden="true"
                      className=" inline-block !h-5 h-5 !w-5 w-5 rounded-full bg-white shadow ring-0 transition  duration-200 ease-in-out"
                    ></span>
                  </button>
                </div>
                <div className="order-2 col-span-4 flex flex-col space-y-2">
                  <label
                    className="text-foreground-light block text-sm leading-4"
                    for="isOptedIntoAi"
                  >
                    Opt-in to sending anonymous data to OpenAI
                  </label>
                  <div
                    className="text-foreground-lighter mt-2 text-sm leading-4 leading-normal"
                    id="isOptedIntoAi-description"
                  >
                    By opting into sending anonymous data, Supabase AI can
                    improve the answers it shows you
                  </div>
                  <p
                    data-state="hide"
                    className="
        data-show:mt-2
        data-show:animate-slide-down-normal
        data-hide:animate-slide-up-normal
        text-sm
        leading-4
       text-red-900 transition-all"
                  ></p>
                </div>
              </div>
              <div data-state="closed">
                <div
                  className="ml-16 flex cursor-pointer items-center space-x-2"
                  type="button"
                  aria-controls="radix-:rkc:"
                  aria-expanded="false"
                  data-state="closed"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    className="sbui-icon transition-all"
                  >
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                  <p className="text-foreground-light text-sm underline">
                    Important information regarding opting in
                  </p>
                </div>
                <div
                  data-state="closed"
                  id="radix-:rkc:"
                  className=" data-open:animate-slide-down-normal data-closed:animate-slide-up-normal  "
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="border-default border-t"></div>
      <div className="flex px-8 py-4">
        <div className="flex w-full items-center justify-end gap-2">
          <div className="flex items-center gap-2">
            <button
              data-size="tiny"
              type="reset"
              className="font-regular text-foreground bg-button hover:bg-selection border-button hover:border-button-hover focus-visible:outline-brand-600 data-[state=open]:bg-selection data-[state=open]:outline-brand-600 data-[state=open]:border-button-hover relative inline-flex h-[26px] cursor-default items-center justify-center space-x-2 rounded-md border px-2.5 py-1 text-center text-xs opacity-50 shadow-sm outline-none outline-0 transition-all duration-200 ease-out focus-visible:outline-4 focus-visible:outline-offset-1"
            >
              {" "}
              <span className="truncate">Cancel</span>{" "}
            </button>
            <button
              data-size="tiny"
              type="submit"
              form="org-general-settings"
              className="font-regular bg-brand-button hover:bg-brand-button/80 border-brand focus-visible:outline-brand-600 data-[state=open]:bg-brand-button/80 data-[state=open]:outline-brand-600 relative inline-flex h-[26px] cursor-default items-center justify-center space-x-2 rounded-md border px-2.5 py-1 text-center text-xs text-white opacity-50 shadow-sm outline-none outline-0 transition-all duration-200 ease-out focus-visible:outline-4 focus-visible:outline-offset-1"
            >
              {" "}
              <span className="truncate">Save</span>{" "}
            </button>
          </div>
        </div>
      </div>
    </div>
  ),
});
