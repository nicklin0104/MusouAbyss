document.addEventListener('DOMContentLoaded', () => {
    const attributeTags1 = document.getElementById('attribute-tags-1');
    const attributeTags2 = document.getElementById('attribute-tags-2');
    const traitTags1 = document.getElementById('trait-tags-1');
    const traitTags2 = document.getElementById('trait-tags-2');
    const traitTags3 = document.getElementById('trait-tags-3');
    
    const heroGrid = document.getElementById('hero-grid');
    const resultsCount = document.getElementById('results-count');
    const emptyState = document.getElementById('empty-state');
    const resetBtn = document.getElementById('reset-btn');

    let allHeroes = [];
    let selectedAttributes = new Set();
    let selectedTraits = new Set();

    // Initialize with direct JS data bypassing fetch limitations on local files
    try {
        allHeroes = MUSOU_DATA;
        initializeFilters(allHeroes);
        renderHeroes(allHeroes);
    } catch (error) {
        console.error('There was a problem loading the data:', error);
        resultsCount.textContent = "資料載入失敗";
    }

    function initializeFilters(heroes) {
        const attributes = new Set();
        const traits = {}; // object to store frequency
        
        heroes.forEach(hero => {
            if (hero['印記(屬性)']) {
                hero['印記(屬性)'].split(',').forEach(item => attributes.add(item.trim()));
            }
            if (hero['印記(特性)']) {
                hero['印記(特性)'].split(',').forEach(item => {
                    let trimItem = item.trim();
                    if (trimItem) traits[trimItem] = (traits[trimItem] || 0) + 1;
                });
            }
        });

        // 整理屬性順序
        const attrGroup1Order = ["力", "技", "堅", "速", "智", "魅"];
        const attrGroup2Order = ["火", "炎", "冰", "風", "雷", "斬"];
        
        const attr1 = attrGroup1Order.filter(a => attributes.has(a));
        const attr2 = attrGroup2Order.filter(a => attributes.has(a));

        // 如果有些屬性未被列入 1-1, 1-2，也可以把它加到 1-2 後面防呆
        const unknownAttrs = Array.from(attributes).filter(a => !attrGroup1Order.includes(a) && !attrGroup2Order.includes(a));
        const finalAttr2 = [...attr2, ...unknownAttrs];

        // 整理特性順序
        const traitGroup1Order = ["魏", "吳", "蜀", "晉", "黃巾黨", "袁紹軍", "董卓軍", "呂布軍", "無所屬"];
        const traitGroup2Order = ["織田", "豐臣", "德川", "上杉", "武田", "真田", "北條", "毛利", "立花", "今川", "淺井", "島津", "伊達", "長宗我部"];
        
        const tr1 = traitGroup1Order.filter(t => traits[t]);
        const tr2 = traitGroup2Order.filter(t => traits[t]);
        
        // 剩下的特性按次數由大到小排
        const tr3 = Object.keys(traits)
            .filter(t => !traitGroup1Order.includes(t) && !traitGroup2Order.includes(t))
            .sort((a, b) => traits[b] - traits[a]);

        // Render tags
        if(attributeTags1) renderTags(attr1, attributeTags1, selectedAttributes, 'attr');
        if(attributeTags2) renderTags(finalAttr2, attributeTags2, selectedAttributes, 'attr');
        
        if(traitTags1) renderTags(tr1, traitTags1, selectedTraits, 'trait');
        if(traitTags2) renderTags(tr2, traitTags2, selectedTraits, 'trait');
        if(traitTags3) renderTags(tr3, traitTags3, selectedTraits, 'trait');
    }

    function renderTags(items, container, activeSet, type) {
        container.innerHTML = '';
        items.forEach(item => {
            if (!item) return;

            const button = document.createElement('button');
            button.className = 'tag';
            button.textContent = item;
            // Add a data attribute so we can find this exact top filter button later
            button.setAttribute('data-tag-value', item);
            button.setAttribute('data-tag-type', type);
            
            button.addEventListener('click', () => {
                toggleTag(item, activeSet, button);
            });

            container.appendChild(button);
        });
    }

    function toggleTag(item, activeSet, buttonElement) {
        if (activeSet.has(item)) {
            activeSet.delete(item);
            if (buttonElement) buttonElement.classList.remove('active');
        } else {
            activeSet.add(item);
            if (buttonElement) buttonElement.classList.add('active');
        }
        applyFilters();
    }

    // 將外部點擊的邏輯打包，讓小小標籤被點擊時，也能更新上方大按鈕的 UI 狀態
    window.handleTinyTagClick = function(item, type) {
        const activeSet = (type === 'attr') ? selectedAttributes : selectedTraits;
        const selector = `button[data-tag-type="${type}"][data-tag-value="${item}"]`;
        const buttonElement = document.querySelector(selector);
        
        // 如果這個標籤已經在 Set 當中，我們就不需要重複 Add，但因為 toggleTag 可以處理 Add/Delete，就復用它。
        // 不過如果使用者已經點擊過，再點 tiny tag 的話等於取消？
        // user requests: "點擊角色特性時, 視為增加篩選條件"
        // 這裡設定為: 如果還沒選，就加進去。如果選了，再次點擊可能沒反應？
        // 就單純如果是「增加篩選條件」：
        if (!activeSet.has(item)) {
            activeSet.add(item);
            if (buttonElement) buttonElement.classList.add('active');
            applyFilters();
        }
    };

    function applyFilters() {
        let filtered = allHeroes;
        if (selectedAttributes.size > 0 || selectedTraits.size > 0) {
            filtered = allHeroes.filter(hero => {
                const heroAttrs = hero['印記(屬性)'] ? hero['印記(屬性)'].split(',').map(s => s.trim()) : [];
                const heroTraits = hero['印記(特性)'] ? hero['印記(特性)'].split(',').map(s => s.trim()) : [];

                const hasAllAttrs = Array.from(selectedAttributes).every(attr => heroAttrs.includes(attr));
                const hasAllTraits = Array.from(selectedTraits).every(trait => heroTraits.includes(trait));

                return hasAllAttrs && hasAllTraits;
            });
        }
        renderHeroes(filtered);
    }

    function renderHeroes(heroes) {
        heroGrid.innerHTML = '';
        resultsCount.textContent = `共 ${heroes.length} 名`;
        
        if (heroes.length === 0) {
            emptyState.classList.remove('hidden');
        } else {
            emptyState.classList.add('hidden');
        }

        heroes.forEach((hero, index) => {
            const card = document.createElement('div');
            card.className = 'hero-card card-enter';
            card.style.animationDelay = `${(index % 12) * 0.05}s`;

            const attrs = hero['印記(屬性)'] ? hero['印記(屬性)'].split(',').map(s => s.trim()) : [];
            const traits = hero['印記(特性)'] ? hero['印記(特性)'].split(',').map(s => s.trim()) : [];

            // Add onClick to tiny tags to filter
            const renderTinyTags = (tagsList, typeClass) => {
                return tagsList.filter(t => t).map(tag => 
                    `<span class="hero-tiny-tag ${typeClass}" onclick="handleTinyTagClick('${tag}', '${typeClass}')">${tag}</span>`
                ).join('');
            };

            card.innerHTML = `
                <div class="hero-name">${hero['英傑']}</div>
                <div class="hero-tags-group">
                    <div class="hero-tag-label">印記(屬性)</div>
                    <div class="hero-tag-list">
                        ${renderTinyTags(attrs, 'attr')}
                    </div>
                </div>
                <div class="hero-tags-group">
                    <div class="hero-tag-label">印記(特性)</div>
                    <div class="hero-tag-list">
                        ${renderTinyTags(traits, 'trait')}
                    </div>
                </div>
            `;
            heroGrid.appendChild(card);
        });
    }

    resetBtn.addEventListener('click', () => {
        selectedAttributes.clear();
        selectedTraits.clear();
        document.querySelectorAll('.tag').forEach(btn => btn.classList.remove('active'));
        applyFilters();
    });
});
