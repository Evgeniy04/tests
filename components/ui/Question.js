import { QuestionCreate } from "./questions/Create/QuestionCreate";

import { Results } from "./questions/Results/Results";

import { Checkbox as CheckboxFill } from "./questions/Fill/Checkbox";
import { Radio as RadioFill } from "./questions/Fill/Radio";
import { Select as SelectFill } from "./questions/Fill/select";
import { TextMath as TextMathFill } from "./questions/Fill/TextMath";

export default function Question({
  index,
  type,
  titleSvg,
  questionAllAnswersSvg,
  isCreate,
  isResults,
}) {
  if (isCreate) {
    return QuestionCreate(index, type);
  } else if (isResults) {
    return Results(type, index, titleSvg, questionAllAnswersSvg);
  } else {
    switch (type) {
      case "radio":
        return RadioFill(index, titleSvg, questionAllAnswersSvg);
      case "select":
        return SelectFill(index, titleSvg, questionAllAnswersSvg);
      case "checkbox":
        return CheckboxFill(index, titleSvg, questionAllAnswersSvg);
      case "textmath":
        return TextMathFill(index, titleSvg);
      default:
        return <></>;
    }
  }
}
