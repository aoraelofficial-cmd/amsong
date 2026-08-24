// API 유틸리티 함수들

const API_BASE = 'tables';

// 사용자 생성
async function createUser(email, name) {
    try {
        const response = await fetch(`${API_BASE}/users`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                email: email,
                name: name,
                total_score: 0,
                last_completed_date: ''
            })
        });
        
        if (!response.ok) {
            throw new Error('회원가입 실패');
        }
        
        return await response.json();
    } catch (error) {
        console.error('회원가입 오류:', error);
        throw error;
    }
}

// 이메일로 사용자 찾기
async function findUserByEmail(email) {
    try {
        console.log('사용자 검색 시작:', email);
        
        // 모든 사용자 가져오기
        const response = await fetch(`${API_BASE}/users?limit=1000`);
        
        if (!response.ok) {
            throw new Error('사용자 검색 실패');
        }
        
        const result = await response.json();
        
        console.log('전체 사용자 수:', result.data.length);
        console.log('전체 사용자 이메일:', result.data.map(u => u.email));
        
        // 정확히 일치하는 이메일 찾기 (대소문자 구분 없이)
        const user = result.data.find(u => u.email.toLowerCase() === email.toLowerCase());
        
        console.log('검색 결과:', user ? '찾음' : '없음', user);
        
        return user || null;
    } catch (error) {
        console.error('사용자 검색 오류:', error);
        throw error;
    }
}

// 사용자 진도 조회
async function getUserProgress(userId) {
    try {
        const response = await fetch(`${API_BASE}/progress?limit=100`);
        
        if (!response.ok) {
            throw new Error('진도 조회 실패');
        }
        
        const result = await response.json();
        
        // 해당 사용자의 진도만 필터링
        const userProgress = result.data.filter(p => p.user_id === userId);
        return userProgress;
    } catch (error) {
        console.error('진도 조회 오류:', error);
        return [];
    }
}

// 챕터 완료 기록
async function completeChapter(userId, chapterDate) {
    try {
        const response = await fetch(`${API_BASE}/progress`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                user_id: userId,
                chapter_date: chapterDate,
                completed: true,
                completed_at: new Date().toISOString()
            })
        });
        
        if (!response.ok) {
            throw new Error('챕터 완료 기록 실패');
        }
        
        return await response.json();
    } catch (error) {
        console.error('챕터 완료 기록 오류:', error);
        throw error;
    }
}

// 사용자 점수 업데이트
async function updateUserScore(userId, totalScore) {
    try {
        // 먼저 사용자 정보 가져오기
        const response = await fetch(`${API_BASE}/users/${userId}`);
        
        if (!response.ok) {
            throw new Error('사용자 정보 조회 실패');
        }
        
        const user = await response.json();
        
        // 점수 업데이트
        const updateResponse = await fetch(`${API_BASE}/users/${userId}`, {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                total_score: totalScore,
                last_completed_date: new Date().toISOString()
            })
        });
        
        if (!updateResponse.ok) {
            throw new Error('점수 업데이트 실패');
        }
        
        return await updateResponse.json();
    } catch (error) {
        console.error('점수 업데이트 오류:', error);
        throw error;
    }
}

// 랭킹 조회 (상위 10명)
async function getTopRankings() {
    try {
        const response = await fetch(`${API_BASE}/users?limit=100&sort=-total_score`);
        
        if (!response.ok) {
            throw new Error('랭킹 조회 실패');
        }
        
        const result = await response.json();
        
        // 점수가 0보다 큰 사용자만 필터링하고 상위 10명
        const topUsers = result.data
            .filter(u => u.total_score > 0)
            .sort((a, b) => b.total_score - a.total_score)
            .slice(0, 10);
        
        return topUsers;
    } catch (error) {
        console.error('랭킹 조회 오류:', error);
        return [];
    }
}
