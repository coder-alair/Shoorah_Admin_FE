import React, { useEffect, useState } from 'react';
import Breadcrumb from '../../component/common/Breadcrumb';
import { Disclosure, DisclosureButton } from '@headlessui/react';
import PropTypes from 'prop-types';
import { CONTENT_TYPE } from '../../utils/constants';
import moment from 'moment';
import { Helmet } from 'react-helmet';
import ApprovalHistory from '../../component/ApprovalHistory/ApprovalHistory';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { getContentApprovalStatus } from '../../utils/helper';

const pages = [
  { name: 'Draft', href: '/draft' },
  { name: 'View Draft', href: '/draft/view' }
];

const faqs = [
  {
    question: 'View comments history'
  }
  // More questions...
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function ViewDraft(props) {
  const [form, setForm] = useState({
    name: '',
    focusName: '',
    comment: '',
    createdBy: '',
    createdOn: '',
    updatedBy: '',
    updatedOn: '',
    status: '',
    type: '',
    id: ''
  });

  useEffect(() => {
    if (props?.location?.state) {
      let propsData = props?.location?.state;
      let arr = [];
      propsData?.focus_ids?.length > 0 &&
        propsData?.focus_ids?.map((item) => {
          arr.push(item.display_name);
        });
      let contentType = '';
      CONTENT_TYPE?.map((type) => {
        if (propsData.contentType === type.value) {
          contentType = type.name;
        }
      });
      setForm({
        name: propsData?.displayName,
        focusName: arr?.length > 0 ? arr?.toString()?.replaceAll(',', ', ') : '',
        createdBy: propsData?.created_by?.name,
        createdOn: moment(propsData?.createdOn).format('YYYY-MM-DD'),
        updatedBy: propsData?.updated_by?.name,
        updatedOn: moment(propsData?.updatedOn).format('YYYY-MM-DD'),
        status: propsData?.contentStatus,
        comment: '',
        id: propsData?.id,
        type: contentType
      });
    }
  }, [props?.location?.state]);

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>View Draft | Shoorah Admin</title>
      </Helmet>
      <Breadcrumb pageList={pages} />
      <div>
        <div className="px-4 sm:px-6 py-10 rounded-[10px] bg-white mt-6">
          <div className="mx-auto 2xl:w-[80%] divide-y-[1px] divide-gray-200">
            <div className="overflow-hidden bg-gray-50 border border-gray-200 shadow-sm sm:rounded-lg">
              <div className="px-4 py-5 flex justify-between sm:px-6">
                <h3 className="text-lg self-center font-medium leading-6 text-gray-900">
                  Content approval status
                </h3>
                <p className="max-w-2xl self-center text-sm text-gray-500">
                  {getContentApprovalStatus(form.status)}
                </p>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Name</dt>
                    <dd className="mt-1 text-sm text-gray-900">{form.name}</dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Content type</dt>
                    <dd className="mt-1 text-sm text-gray-900">{form.type}</dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Focus names</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {form.focusName ? form.focusName : '━━'}
                    </dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Created on</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {moment(form?.createdOn)?.format('lll')}
                    </dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Updated by</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {form.updatedBy ? form.updatedBy : '━━'}
                    </dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Updated on</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {form?.updatedOn ? moment(form?.updatedOn)?.format('lll') : '━━'}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
            {props?.location?.state?.comments?.length > 0 && (
              <div className="pt-3 mt-4">
                <div className="bg-gray-50 border border-gray-200 shadow-sm sm:rounded-lg px-4">
                  <div className="divide-y-2 divide-gray-200">
                    <dl className="">
                      {faqs.map((faq) => (
                        <Disclosure as="div" key={faq.question} className="sm:px-4 py-4">
                          {({ open }) => (
                            <>
                              <dt className="text-lg">
                                <DisclosureButton className="flex w-full items-start justify-between text-left text-gray-400">
                                  <span className="font-medium text-lg text-gray-900">
                                    {faq.question}
                                  </span>
                                  <span className="ml-6 flex h-7 items-center">
                                    <ChevronDownIcon
                                      className={classNames(
                                        open ? '-rotate-180' : 'rotate-0',
                                        'h-6 w-6 transform'
                                      )}
                                      aria-hidden="true"
                                    />
                                  </span>
                                </DisclosureButton>
                              </dt>
                              <DisclosurePanel as="dd" className="mt-7">
                                <ApprovalHistory data={props?.location?.state?.comments} />
                              </DisclosurePanel>
                            </>
                          )}
                        </Disclosure>
                      ))}
                    </dl>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

ViewDraft.propTypes = {
  location: PropTypes.any
};
