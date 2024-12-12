async function getLangId(resolvedLanguage: string | undefined) {
  try {
    let id = 1;
    switch (resolvedLanguage) {
      case "ru":
        id = 1;
        break;
      case "kg":
        id = 2;
        break;
      case "ky":
        id = 2;
        break;
      default:
        id = 1;
        break;
    }
    return id;
  } catch (err) {
    console.log("error getLangId: ", err.message);
    return 1;
  }
}

const LangService = {
  getLangId,
};

export default LangService;
