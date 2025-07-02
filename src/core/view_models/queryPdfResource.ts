function queryPdfResource(id: number) {
    return `./resources/pdf/${id + 1}.pdf`;
}

export { queryPdfResource };
