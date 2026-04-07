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
    const toggleAltered = document.getElementById('toggle-altered');
    const toggleBreakthrough = document.getElementById('toggle-breakthrough');

    toggleAltered.addEventListener('change', applyFilters);
    toggleBreakthrough.addEventListener('change', applyFilters);

    let allHeroes = [];
    let selectedAttributes = new Set();
    let selectedTraits = new Set();

    // 硬編碼指定三國與戰國的無所屬名單，避免改動來源資料
    const sanguoUnaffiliated = ["張角", "孟獲", "祝融", "左慈", "董白", "張角 (起源)", "紫鸞"];
    const sengokuUnaffiliated = ["阿國", "石川五右衛門", "雜賀孫市"];

    // 預期排列的順序定義
    const attrGroup1Order = ["力", "技", "堅", "速", "智", "魅"];
    const attrGroup2Order = ["火", "炎", "冰", "風", "雷", "斬"];
    const traitGroup1Order = ["魏", "吳", "蜀", "晉", "黃巾黨", "袁紹軍", "董卓軍", "呂布軍", "無所屬 (三國)"];
    const traitGroup2Order = ["織田", "豐臣", "德川", "上杉", "武田", "真田", "北條", "毛利", "立花", "今川", "淺井", "島津", "伊達", "長宗我部", "無所屬 (戰國)"];

    // Initialize with direct JS data bypassing fetch limitations on local files
    try {
        allHeroes = MUSOU_DATA;
        initializeFilters(allHeroes);
        applyFilters(); // 使用 applyFilters() 來觸發初始的畫面渲染與排序
    } catch (error) {
        console.error('There was a problem loading the data:', error);
        resultsCount.textContent = "資料載入失敗";
    }

    function initializeFilters(heroes) {
        const attributes = new Set();
        const traits = {}; // object to store frequency
        
        // 資料預處理階段
        heroes.forEach(hero => {
            const parseTags = (str) => {
                if (!str) return [];
                return str.split(',').map(s => {
                    const txt = s.trim();
                    if (!txt) return null;
                    const isBreakthrough = txt.startsWith('[') && txt.endsWith(']');
                    const baseName = isBreakthrough ? txt.slice(1, -1) : txt;
                    return { name: baseName, isBreakthrough };
                }).filter(o => o);
            };

            hero._attrsObj = parseTags(hero['印記(屬性)']);
            hero._attrs = hero._attrsObj.map(o => o.name);
            
            hero._traitsOriginalObj = parseTags(hero['印記(特性)']);
            hero._traitsOriginal = hero._traitsOriginalObj.map(o => o.name);
            
            // 建立 proxy traits 作為內部邏輯使用
            hero._traits = [];
            hero._traitsOriginal.forEach(t => {
                hero._traits.push(t); // 保留最原始的標籤 (例如單純的 "無所屬")
                if (t === '無所屬') {
                    if (sanguoUnaffiliated.includes(hero['英傑'])) hero._traits.push('無所屬 (三國)');
                    else if (sengokuUnaffiliated.includes(hero['英傑'])) hero._traits.push('無所屬 (戰國)');
                    else hero._traits.push('無所屬 (其他)');
                }
            });
            
            hero._attrs.forEach(a => attributes.add(a));
            hero._traits.forEach(t => traits[t] = (traits[t] || 0) + 1);
        });

        const attr1 = attrGroup1Order.filter(a => attributes.has(a));
        const attr2 = attrGroup2Order.filter(a => attributes.has(a));
        const unknownAttrs = Array.from(attributes).filter(a => !attrGroup1Order.includes(a) && !attrGroup2Order.includes(a));
        const finalAttr2 = [...attr2, ...unknownAttrs];

        const tr1 = traitGroup1Order.filter(t => traits[t]);
        const tr2 = traitGroup2Order.filter(t => traits[t]);
        
        // 剩下的特性按次數由大到小排 (允許最原始的 "無所屬" 出現，等同於 "無所屬 (所有)")
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
            // 若原生標籤為 "無所屬"，在上方大按鈕呈現為 "無所屬 (所有)" 以利辨識
            button.textContent = item === '無所屬' ? '無所屬 (所有)' : item;
            
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
        
        // 直接使用 toggleTag 以支援切換 (並且會同步大按鈕狀態)
        toggleTag(item, activeSet, buttonElement);
    };

    function applyFilters() {
        let filtered = allHeroes;
        
        const showAltered = toggleAltered.checked;
        const includeBreakthrough = toggleBreakthrough.checked;

        if (!showAltered) {
            filtered = filtered.filter(hero => !hero['英傑'].includes('(異化)'));
        }

        if (selectedAttributes.size > 0 || selectedTraits.size > 0) {
            filtered = filtered.filter(hero => {
                let availableAttrs = hero._attrsObj.filter(o => includeBreakthrough || !o.isBreakthrough).map(o => o.name);
                let availableTraitsOriginal = hero._traitsOriginalObj.filter(o => includeBreakthrough || !o.isBreakthrough).map(o => o.name);
                
                let availableTraits = [];
                availableTraitsOriginal.forEach(t => {
                    availableTraits.push(t);
                    if (t === '無所屬') {
                        if (sanguoUnaffiliated.includes(hero['英傑'])) availableTraits.push('無所屬 (三國)');
                        else if (sengokuUnaffiliated.includes(hero['英傑'])) availableTraits.push('無所屬 (戰國)');
                        else availableTraits.push('無所屬 (其他)');
                    }
                });

                const hasAllAttrs = Array.from(selectedAttributes).every(attr => availableAttrs.includes(attr));
                const hasAllTraits = Array.from(selectedTraits).every(trait => availableTraits.includes(trait));
                return hasAllAttrs && hasAllTraits;
            });
        }
        
        // 設定排序規則：國家優先，名稱次之
        const allCountriesOrder = [...traitGroup1Order, ...traitGroup2Order];
        filtered.sort((a, b) => {
            const getCountryRank = (hero) => {
                for (let i = 0; i < allCountriesOrder.length; i++) {
                    if (hero._traits.includes(allCountriesOrder[i])) {
                        return i;
                    }
                }
                return 999; // 未知/無國家
            };

            const rankA = getCountryRank(a);
            const rankB = getCountryRank(b);

            if (rankA !== rankB) {
                return rankA - rankB; // 第一階：國家代號小的排前面
            }
            
            // 第二階：姓名
            return a['英傑'].localeCompare(b['英傑'], 'zh-TW');
        });

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

            // 對於 tiny tags，我們傳進 onclick handler() 的是原始的 tag baseName.
            // 透過 _attrsObj / _traitsOriginalObj 我們能知道它是不是 breakthrough 來加上 css
            const renderTinyTags = (objList, typeClass) => {
                return objList.map(o => {
                    const extraClass = o.isBreakthrough ? ' breakthrough-tag' : '';
                    return `<span class="hero-tiny-tag ${typeClass}${extraClass}" onclick="handleTinyTagClick('${o.name}', '${typeClass}')">${o.name}</span>`
                }).join('');
            };

            card.innerHTML = `
                <div class="hero-name">${hero['英傑']}</div>
                <div class="hero-tags-group">
                    <div class="hero-tag-label">印記(屬性)</div>
                    <div class="hero-tag-list">
                        ${renderTinyTags(hero._attrsObj, 'attr')}
                    </div>
                </div>
                <div class="hero-tags-group">
                    <div class="hero-tag-label">印記(特性)</div>
                    <div class="hero-tag-list">
                        ${renderTinyTags(hero._traitsOriginalObj, 'trait')}
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
