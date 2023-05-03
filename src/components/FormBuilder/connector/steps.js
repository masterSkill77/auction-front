export function stepsConnectorIn(page, i) {
    return {
        'order': i + 1,
        'fr': {
            'name': page.name,
            'content': page.description
        },
    };
}
