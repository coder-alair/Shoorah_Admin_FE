import {
    isSuperAndSubAdmin,
    isCopanySuperOrSubAdmin,
} from '../../../utils/helper';
import { SURVEY_CONSTANT } from '../../../core/web.constants';
const surveyButtons = () => {

    const renderButtons = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const tempId = urlParams.get('tempId');
        const surveyFromTemplateId = urlParams.get('surveyFromTemplateId');
        const isDraft = urlParams.get('isDraft');
        const surveyId = urlParams.get('surveyId');

        const isSuperAdmin = isSuperAndSubAdmin();
        const isCompanyAdmin = isCopanySuperOrSubAdmin();

        if (!tempId && !surveyFromTemplateId && !surveyId) {
            return (
                <>
                    <button
                        className="m-1 min-w-[200px] border-2 text-center font-bold border-shoorah-secondary p-3 text-shoorah-secondary rounded-full"
                        onClick={saveAsDraft}
                    >
                        {SURVEY_CONSTANT.NEW_SURVEY_BUTTON_DRAFT}
                    </button>
                    {isSuperAdmin && (
                        <button
                            className="m-1 min-w-[200px] border-2 text-center font-bold border-shoorah-secondary p-3 text-shoorah-secondary rounded-full"
                            onClick={handleSaveAsTemplate}
                        >
                            {SURVEY_CONSTANT.NEW_SURVEY_BUTTON_TEMPLATE}
                        </button>
                    )}
                    <button
                        className="m-1 min-w-[200px] border-2 text-center font-bold border-shoorah-secondary p-3 text-shoorah-secondary rounded-full"
                        onClick={createSurveyButton}
                    >
                        {SURVEY_CONSTANT.CREATE_SURVEY}
                    </button>
                </>
            );
        }

        if (tempId) {
            return (
                isSuperAdmin && (
                    <button
                        className="m-1 min-w-[200px] border-2 text-center font-bold border-shoorah-secondary p-3 text-shoorah-secondary rounded-full"
                        onClick={handleSaveAsTemplate}
                    >
                        {SURVEY_CONSTANT.MODIFY_TEMPLATE}
                    </button>
                )
            );
        }

        if (surveyFromTemplateId) {
            return (
                <>
                    <button
                        className="m-1 min-w-[200px] border-2 text-center font-bold border-shoorah-secondary p-3 text-shoorah-secondary rounded-full"
                        onClick={saveAsDraft}
                    >
                        {SURVEY_CONSTANT.NEW_SURVEY_BUTTON_DRAFT}
                    </button>
                    <button
                        className="m-1 min-w-[200px] border-2 text-center font-bold border-shoorah-secondary p-3 text-shoorah-secondary rounded-full"
                        onClick={createSurveyButton}
                    >
                        {SURVEY_CONSTANT.CREATE_SURVEY}
                    </button>
                </>
            );
        }

        if (isDraft === 'true' && surveyId) {
            return (
                <>
                    <button
                        className="m-1 min-w-[200px] border-2 text-center font-bold border-shoorah-secondary p-3 text-shoorah-secondary rounded-full"
                        onClick={saveAsDraft}
                    >
                        {SURVEY_CONSTANT.NEW_SURVEY_BUTTON_DRAFT}
                    </button>
                    <button
                        className="m-1 min-w-[200px] border-2 text-center font-bold border-shoorah-secondary p-3 text-shoorah-secondary rounded-full"
                        onClick={createSurveyButton}
                    >
                        {SURVEY_CONSTANT.CREATE_SURVEY}
                    </button>
                </>
            );
        }

        return null;
    };

    return (
        <div>
            {!isPreview && renderButtons()}
        </div>
    );
};

export default surveyButtons;